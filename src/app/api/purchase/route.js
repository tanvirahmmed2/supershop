import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const client = await pool.connect();
    try {
        const {
            branch_id, supplier_id, staff_id, total_amount,
            discount, shipping_cost, grand_total, items,
            payment_method, transaction_id, notes
        } = await req.json();

        await client.query('BEGIN');

        const invoice_no = `PUR-${Date.now()}`;

        const purchaseRes = await client.query(
            `INSERT INTO purchases (branch_id, supplier_id, staff_id, invoice_no, total_amount, discount, shipping_cost, grand_total, purchase_status, payment_status, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'received', 'paid', $9) RETURNING purchase_id`,
            [branch_id, supplier_id, staff_id, invoice_no, total_amount, discount, shipping_cost, grand_total, notes]
        );

        const purchaseId = purchaseRes.rows[0].purchase_id;

        // NEW: Insert into purchase_payments
        await client.query(
            `INSERT INTO purchase_payments (purchase_id, staff_id, amount_paid, payment_method, transaction_id, note)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [purchaseId, staff_id, grand_total, payment_method || 'cash', transaction_id || null, notes]
        );

        for (const item of items) {
            await client.query(
                `INSERT INTO purchase_items (purchase_id, product_id, quantity, purchase_price)
                 VALUES ($1, $2, $3, $4)`,
                [purchaseId, item.product_id, item.quantity, item.purchase_price]
            );

            await client.query(
                `INSERT INTO inventory (branch_id, product_id, stock, updated_at)
                 VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                 ON CONFLICT (branch_id, product_id)
                 DO UPDATE SET 
                    stock = inventory.stock + EXCLUDED.stock,
                    updated_at = CURRENT_TIMESTAMP`,
                [branch_id, item.product_id, item.quantity]
            );
        }

        await client.query('COMMIT');
        return NextResponse.json({ success: true, message: 'Purchase and Payment saved', invoice_no }, { status: 201 });

    } catch (error) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const branch_id = searchParams.get('branch_id');

        let query = `
            SELECT p.*, s.name as supplier_name, st.name as staff_name, b.name as branch_name
            FROM purchases p
            LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
            LEFT JOIN staffs st ON p.staff_id = st.staff_id
            LEFT JOIN branches b ON p.branch_id = b.branch_id
        `;
        let values = [];

        if (branch_id) {
            query += ` WHERE p.branch_id = $1`;
            values.push(branch_id);
        }

        query += ` ORDER BY p.created_at DESC`;

        const data = await pool.query(query, values);

        if (data.rowCount === 0) {
            return NextResponse.json({ success: true, message: 'No purchases found', payload: [] }, { status: 200 });
        }

        return NextResponse.json({
            success: true, 
            message: 'Purchases fetched successfully', 
            payload: data.rows
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    const client = await pool.connect();
    try {
        const { purchase_id, purchase_status } = await req.json();

        if (!purchase_id || purchase_status !== 'returned') {
            return NextResponse.json({ success: false, message: 'Invalid request data' }, { status: 400 });
        }

        await client.query('BEGIN');

        const purchaseCheck = await client.query(
            'SELECT branch_id, purchase_status FROM purchases WHERE purchase_id = $1',
            [purchase_id]
        );

        if (purchaseCheck.rowCount === 0) {
            return NextResponse.json({ success: false, message: 'Purchase not found' }, { status: 404 });
        }

        if (purchaseCheck.rows[0].purchase_status === 'returned') {
            return NextResponse.json({ success: false, message: 'Purchase already marked as returned' }, { status: 400 });
        }

        const branch_id = purchaseCheck.rows[0].branch_id;

        const items = await client.query(
            'SELECT product_id, quantity FROM purchase_items WHERE purchase_id = $1',
            [purchase_id]
        );

        for (const item of items.rows) {
            await client.query(
                `UPDATE inventory SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP 
                 WHERE branch_id = $2 AND product_id = $3`,
                [item.quantity, branch_id, item.product_id]
            );
        }

        await client.query(
            "UPDATE purchases SET purchase_status = 'returned', updated_at = CURRENT_TIMESTAMP WHERE purchase_id = $1",
            [purchase_id]
        );

        await client.query('COMMIT');
        return NextResponse.json({ success: true, message: 'Purchase returned and inventory decreased' }, { status: 200 });

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
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: 'Purchase ID required' }, { status: 400 });
        }

        await client.query('BEGIN');

        const purchaseCheck = await client.query(
            'SELECT branch_id, purchase_status FROM purchases WHERE purchase_id = $1',
            [id]
        );

        if (purchaseCheck.rowCount === 0) {
            return NextResponse.json({ success: false, message: 'Purchase not found' }, { status: 404 });
        }

        const branch_id = purchaseCheck.rows[0].branch_id;
        const status = purchaseCheck.rows[0].purchase_status;

        if (status !== 'returned') {
            const items = await client.query(
                'SELECT product_id, quantity FROM purchase_items WHERE purchase_id = $1',
                [id]
            );

            for (const item of items.rows) {
                await client.query(
                    `UPDATE inventory SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP 
                     WHERE branch_id = $2 AND product_id = $3`,
                    [item.quantity, branch_id, item.product_id]
                );
            }
        }

        await client.query('DELETE FROM purchases WHERE purchase_id = $1', [id]);

        await client.query('COMMIT');
        return NextResponse.json({ success: true, message: 'Purchase deleted and stock adjusted' }, { status: 200 });

    } catch (error) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}