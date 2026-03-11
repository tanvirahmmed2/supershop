import { pool } from "@/lib/database/db";
import { isStaff } from "@/lib/middleware";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const branch_id = searchParams.get('branch_id');
        const sale_id = searchParams.get('sale_id');

        let query = `
            SELECT s.*, c.name as customer_name, c.phone as customer_phone, st.name as staff_name, b.name as branch_name
            FROM sales s
            LEFT JOIN customers c ON s.customer_id = c.customer_id
            JOIN staffs st ON s.staff_id = st.staff_id
            JOIN branches b ON s.branch_id = b.branch_id
        `;
        let values = [];

        if (sale_id) {
            query += ` WHERE s.sale_id = $1`;
            values.push(sale_id);
        } else if (branch_id) {
            query += ` WHERE s.branch_id = $1`;
            values.push(branch_id);
        }

        query += ` ORDER BY s.created_at DESC`;

        const res = await pool.query(query, values);
        return NextResponse.json({ success: true, payload: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    const client = await pool.connect();
    try {
        const auth = await isStaff();
        
        if (!auth || !auth.success) {
            return NextResponse.json({ 
                success: false, message: "Unauthorized: Please login" 
            }, { status: 401 });
        }

        const auth_branch_id = auth.payload?.branch_id;
        const staff_id = auth.payload?.staff_id;

        const body = await req.json();
        const {
            branch_id,
            customer_phone,
            total_amount,
            discount_amount,
            grand_total,
            items,
            payment_method,
            transaction_id,
            notes
        } = body;

        if (Number(branch_id) !== Number(auth_branch_id)) {
            return NextResponse.json({ 
                success: false, message: `Branch mismatch.` 
            }, { status: 400 });
        }

        await client.query('BEGIN');

        // --- CUSTOMER LOGIC (FIXED) ---
        let customerId = null;
        if (customer_phone && customer_phone.trim() !== "") {
            const customerRes = await client.query(
                'SELECT customer_id FROM customers WHERE phone = $1',
                [customer_phone]
            );

            if (customerRes.rowCount > 0) {
                customerId = customerRes.rows[0].customer_id;
            } else {
                const newCustomer = await client.query(
                    `INSERT INTO customers (name, phone, points) 
                     VALUES ($1, $2, 0) RETURNING customer_id`,
                    ['Walk-in Customer', customer_phone]
                );
                customerId = newCustomer.rows.customer_id;
            }
        }

        const invoice_no = `SAL-${Date.now()}`;

        const saleRes = await client.query(
            `INSERT INTO sales (
                branch_id, staff_id, customer_id, invoice_no, 
                total_amount, discount_amount, grand_total, 
                notes, sale_status, payment_status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'completed', 'paid') 
            RETURNING sale_id`,
            [branch_id, staff_id, customerId, invoice_no, total_amount, discount_amount, grand_total, notes]
        );
        // Use to access the first row
        const saleId = saleRes.rows.sale_id;

        // --- PAYMENT RECORD ---
        await client.query(
            `INSERT INTO sale_payments (sale_id, amount_paid, payment_method, transaction_id)
             VALUES ($1, $2, $3, $4)`,
            [saleId, grand_total, payment_method, transaction_id]
        );

        // --- ITEMS & INVENTORY ---
        for (const item of items) {
            await client.query(
                `INSERT INTO sale_products (sale_id, product_id, quantity, unit_price, sub_total)
                 VALUES ($1, $2, $3, $4, $5)`,
                [saleId, item.product_id, item.quantity, item.unit_price, (item.quantity * item.unit_price)]
            );

            const updateStock = await client.query(
                `UPDATE inventory SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP 
                 WHERE branch_id = $2 AND product_id = $3 AND stock >= $1`,
                [item.quantity, branch_id, item.product_id]
            );

            if (updateStock.rowCount === 0) {
                const actual = await client.query('SELECT stock FROM inventory WHERE branch_id = $1 AND product_id = $2', [branch_id, item.product_id]);
                // Use here as well
                const available = actual.rows?.stock || 0;
                throw new Error(`Insufficient stock for Product ID ${item.product_id}. Available: ${available}, Required: ${item.quantity}`);
            }
        }

        await client.query('COMMIT');
        return NextResponse.json({ 
            success: true, message: 'Sale completed', invoice_no 
        }, { status: 201 });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("SERVER_ERROR:", error.message);
        return NextResponse.json({ 
            success: false, message: error.message 
        }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function PATCH(req) {
    const client = await pool.connect();
    try {
        const { sale_id } = await req.json();
        await client.query('BEGIN');

        const saleCheck = await client.query(`SELECT branch_id, sale_status FROM sales WHERE sale_id = $1`, [sale_id]);
        if (saleCheck.rowCount === 0) throw new Error("Sale not found");
        if (saleCheck.rows.sale_status === 'returned') throw new Error("Sale already returned");

        const branch_id = saleCheck.rows.branch_id;

        const items = await client.query(`SELECT product_id, quantity FROM sale_products WHERE sale_id = $1`, [sale_id]);

        for (const item of items.rows) {
            await client.query(
                `UPDATE inventory SET stock = stock + $1, updated_at = CURRENT_TIMESTAMP 
                 WHERE branch_id = $2 AND product_id = $3`,
                [item.quantity, branch_id, item.product_id]
            );
        }

        await client.query(`UPDATE sales SET sale_status = 'returned' WHERE sale_id = $1`, [sale_id]);

        await client.query('COMMIT');
        return NextResponse.json({ success: true, message: 'Sale returned and stock restored' });
    } catch (error) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function DELETE(req) {
    const client = await pool.connect();
    try {
        const { sale_id } = await req.json();
        await client.query('BEGIN');

        const saleCheck = await client.query(`SELECT branch_id, sale_status FROM sales WHERE sale_id = $1`, [sale_id]);
        if (saleCheck.rowCount === 0) throw new Error("Sale not found");

        const { branch_id, sale_status } = saleCheck.rows;

        if (sale_status !== 'returned') {
            const items = await client.query(`SELECT product_id, quantity FROM sale_products WHERE sale_id = $1`, [sale_id]);
            for (const item of items.rows) {
                await client.query(
                    `UPDATE inventory SET stock = stock + $1, updated_at = CURRENT_TIMESTAMP 
                     WHERE branch_id = $2 AND product_id = $3`,
                    [item.quantity, branch_id, item.product_id]
                );
            }
        }

        await client.query(`DELETE FROM sales WHERE sale_id = $1`, [sale_id]);

        await client.query('COMMIT');
        return NextResponse.json({ success: true, message: 'Sale deleted and stock restored' });
    } catch (error) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}