import { pool } from "@/lib/database/db";
import { isISales } from "@/lib/middleware";
import { isUserLogin } from "@/lib/usermiddleware";
import { NextResponse } from "next/server";


export async function POST(req) {
    const client = await pool.connect();
    try {
        const auth = await isUserLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const { items, address, notes } = await req.json();
        const productIds = items.map(i => i.product_id);

        await client.query('BEGIN');

        const branchCheck = await client.query(`
            SELECT b.branch_id, COUNT(i.product_id) as match_count
            FROM branches b
            JOIN inventory i ON b.branch_id = i.branch_id
            WHERE i.product_id = ANY($1) AND i.stock > 0
            GROUP BY b.branch_id
            ORDER BY match_count DESC LIMIT 1
        `, [productIds]);

        const primaryBranchId = branchCheck.rows[0]?.branch_id || 1; 

        const customerRes = await client.query("SELECT customer_id FROM customers WHERE phone = $1", [auth.payload.phone]);
        let customerId = customerRes.rows[0]?.customer_id;

        if (!customerId) {
            const newCust = await client.query(
                "INSERT INTO customers (name, phone, address) VALUES ($1, $2, $3) RETURNING customer_id",
                [auth.payload.name, auth.payload.phone, address]
            );
            customerId = newCust.rows[0].customer_id;
        }

        const invoiceNo = `INV-${Date.now()}`;
        const subtotal = items.reduce((acc, i) => acc + (i.sale_price - i.discount_price) * i.quantity, 0);
        const grandTotal = subtotal + 120; 

        await client.query(`
            INSERT INTO sales (branch_id, staff_id, customer_id, invoice_no, total_amount, grand_total, sale_status, payment_status, notes)
            VALUES ($1, $2, $3, $4, $5, $6, 'pending', 'unpaid', $7)
        `, [primaryBranchId, 1, customerId, invoiceNo, subtotal, grandTotal, JSON.stringify(items)]);

        await client.query('COMMIT');
        return NextResponse.json({ success: true, invoice_no: invoiceNo });

    } catch (e) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function PATCH(req) {
    const client = await pool.connect();
    try {
        const { sale_id, action } = await req.json(); 
        await client.query('BEGIN');

        const saleRes = await client.query("SELECT * FROM sales WHERE sale_id = $1", [sale_id]);
        if (saleRes.rowCount === 0) throw new Error("Order not found");
        const sale = saleRes.rows[0];

        if (action === 'confirm') {
            const items = JSON.parse(sale.notes);

            for (const item of items) {
                const unitPrice = item.sale_price - item.discount_price;
                
                await client.query(`
                    INSERT INTO sale_products (sale_id, product_id, quantity, unit_price, sub_total)
                    VALUES ($1, $2, $3, $4, $5)
                `, [sale_id, item.product_id, item.quantity, unitPrice, unitPrice * item.quantity]);

                const stockCheck = await client.query(
                    "SELECT stock FROM inventory WHERE branch_id = $1 AND product_id = $2",
                    [sale.branch_id, item.product_id]
                );
                const availableAtPrimary = stockCheck.rows[0]?.stock || 0;

                if (availableAtPrimary >= item.quantity) {
                    await client.query(`
                        UPDATE inventory SET stock = stock - $1 
                        WHERE branch_id = $2 AND product_id = $3
                    `, [item.quantity, sale.branch_id, item.product_id]);
                } else {
                    const altBranch = await client.query(`
                        SELECT branch_id FROM inventory 
                        WHERE product_id = $1 AND stock >= $2 AND branch_id != $3
                        LIMIT 1
                    `, [item.product_id, item.quantity, sale.branch_id]);

                    if (altBranch.rowCount > 0) {
                        const targetBranchId = altBranch.rows[0].branch_id;
                        
                        await client.query(`
                            INSERT INTO alerts (sale_id, target_branch_id, requesting_branch_id, product_id, quantity, note)
                            VALUES ($1, $2, $3, $4, $5, $6)
                        `, [
                            sale_id, 
                            targetBranchId, 
                            sale.branch_id, 
                            item.product_id, 
                            item.quantity, 
                            `Fulfillment for Invoice ${sale.invoice_no}`
                        ]);

                        await client.query(`
                            UPDATE inventory SET stock = stock - $1 
                            WHERE branch_id = $2 AND product_id = $3
                        `, [item.quantity, targetBranchId, item.product_id]);
                    } else {
                        throw new Error(`Product ${item.product_id} is out of stock across all branches.`);
                    }
                }
            }

            await client.query(`
                INSERT INTO sale_payments (sale_id, amount_paid, payment_method)
                VALUES ($1, 0, 'COD')
            `, [sale_id]);

            await client.query("UPDATE sales SET sale_status = 'pending', notes = 'Confirmed by staff' WHERE sale_id = $1", [sale_id]);
        }

        if (action === 'complete') {
            await client.query(`
                UPDATE sales SET sale_status = 'completed', payment_status = 'paid' WHERE sale_id = $1
            `, [sale_id]);

            await client.query(`
                UPDATE sale_payments SET amount_paid = $1, payment_date = CURRENT_TIMESTAMP WHERE sale_id = $2
            `, [sale.grand_total, sale_id]);
        }

        await client.query('COMMIT');
        return NextResponse.json({ success: true, message: `Order ${action}ed successfully` });
    } catch (e) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('sale_id');
        await pool.query("DELETE FROM sales WHERE sale_id = $1 AND sale_status = 'pending'", [id]);
        return NextResponse.json({ success: true, message: "Order deleted" });
    } catch (e) {
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const auth = await isISales();
        
        if (!auth.success) {
            return NextResponse.json({
                success: false, 
                message: auth.message
            }, { status: 401 });
        }

        const branch_id = auth.payload?.branch_id; 

        if (!branch_id) {
            return NextResponse.json({
                success: false,
                message: "Branch ID not found in session"
            }, { status: 400 });
        }

        const query = `
            SELECT 
                s.sale_id,
                s.invoice_no,
                s.sale_date,
                s.grand_total,
                s.sale_status,
                s.payment_status,
                s.notes,
                c.name as customer_name,
                c.phone as customer_phone,
                c.address as customer_address,
                b.name as branch_name,
                (SELECT COUNT(*) FROM sale_products sp WHERE sp.sale_id = s.sale_id) as items_count
            FROM public.sales s
            LEFT JOIN public.customers c ON s.customer_id = c.customer_id
            LEFT JOIN public.branches b ON s.branch_id = b.branch_id
            WHERE s.sale_status = 'pending' 
            AND s.branch_id = $1
            ORDER BY s.created_at DESC
        `;

        const res = await pool.query(query, [branch_id]);

        return NextResponse.json({
            success: true,
            count: res.rowCount,
            payload: res.rows
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}