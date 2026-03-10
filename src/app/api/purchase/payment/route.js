import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const branch_id = searchParams.get('branch_id');

        let query = `
            SELECT 
                pp.*, 
                p.invoice_no, 
                s.name as staff_name, 
                b.name as branch_name,
                sup.name as supplier_name
            FROM purchase_payments pp
            JOIN purchases p ON pp.purchase_id = p.purchase_id
            JOIN staffs s ON pp.staff_id = s.staff_id
            JOIN branches b ON p.branch_id = b.branch_id
            JOIN suppliers sup ON p.supplier_id = sup.supplier_id
        `;
        
        let values = [];

        if (branch_id) {
            query += ` WHERE p.branch_id = $1`;
            values.push(branch_id);
        }

        query += ` ORDER BY pp.payment_date DESC`;

        const data = await pool.query(query, values);

        if (data.rowCount === 0) {
            return NextResponse.json({
                success: true, 
                message: branch_id ? "No payments found for this branch" : "No payments found", 
                payload: []
            }, { status: 200 });
        }

        return NextResponse.json({
            success: true, 
            message: 'Successfully fetched payment records', 
            payload: data.rows
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false, 
            message: error.message
        }, { status: 500 });
    }
}