import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const client = await pool.connect();
    try {
        const {
            branch_id,
            supplier_id,
            staff_id,
            total_amount,
            discount,
            shipping_cost,
            grand_total,
            items,
            payment_method,
            transaction_id,
            notes
        } = await req.json();

        // 1. Validation
        if (!items || items.length === 0 || !supplier_id || !branch_id) {
            return NextResponse.json({
                success: false, message: 'Missing required purchase data'
            }, { status: 400 });
        }

        await client.query('BEGIN');

        // 2. Generate Invoice Number
        const invoice_no = `PUR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // 3. Insert Purchase Record
        const purchaseRes = await client.query(
            `INSERT INTO purchases (
                branch_id, supplier_id, staff_id, invoice_no, 
                total_amount, discount, shipping_cost, grand_total, 
                purchase_status, payment_status, notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'received', 'paid', $9) RETURNING purchase_id`,
            [branch_id, supplier_id, staff_id, invoice_no, total_amount, discount, shipping_cost, grand_total, notes]
        );

        if (purchaseRes.rowCount === 0) {
            throw new Error("Failed to insert purchase record");
        }

        const purchaseId = purchaseRes.rows[0].purchase_id;

        // 4. Insert Payment Record
        await client.query(
            `INSERT INTO purchase_payments (
                purchase_id, staff_id, amount_paid, 
                payment_method, transaction_id, note
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [purchaseId, staff_id, grand_total, payment_method, transaction_id, notes]
        );

        // 5. Update Inventory (UPSERT logic per item)
        // Using a loop to handle multiple products in one purchase
        for (const item of items) {
            await client.query(
                `INSERT INTO inventory (branch_id, product_id, stock, updated_at)
                 VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                 ON CONFLICT (branch_id, product_id)
                 DO UPDATE SET 
                    stock = inventory.stock + EXCLUDED.stock,
                    last_restocked_at = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP`,
                [branch_id, item.product_id, item.quantity]
            );
        }

        await client.query('COMMIT');

        return NextResponse.json({
            success: true, 
            message: 'Purchase recorded and stock updated successfully',
            invoice_no 
        }, { status: 201 });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Purchase Error:", error);
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });

    } finally {
        client.release();
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const branch_id = searchParams.get('branch_id');

        let query = `
            SELECT p.*, s.name as supplier_name, st.name as staff_name 
            FROM purchases p
            JOIN suppliers s ON p.supplier_id = s.supplier_id
            JOIN staffs st ON p.staff_id = st.staff_id
        `;
        let values = [];

        if (branch_id) {
            query += ` WHERE p.branch_id = $1`;
            values.push(branch_id);
        }

        query += ` ORDER BY p.created_at DESC`;

        const data = await pool.query(query, values);

        return NextResponse.json({
            success: true, 
            message: 'Purchases fetched successfully', 
            payload: data.rows
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });
    }
}