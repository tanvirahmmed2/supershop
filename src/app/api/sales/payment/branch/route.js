import { pool } from "@/lib/database/db";
import { isStaff } from "@/lib/middleware";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const auth = await isStaff();
        if (!auth.success) {
            return NextResponse.json({
                success: false, message: auth.message
            }, { status: 401 });
        }

        const branch_id = auth.payload.branch_id;

        let query = `
            SELECT 
                sp.*, 
                s.invoice_no, 
                st.name as staff_name, 
                b.name as branch_name,
                c.name as customer_name,
                c.phone as customer_phone
            FROM sale_payments sp
            JOIN sales s ON sp.sale_id = s.sale_id
            JOIN staffs st ON s.staff_id = st.staff_id
            JOIN branches b ON s.branch_id = b.branch_id
            LEFT JOIN customers c ON s.customer_id = c.customer_id
        `;

        let values = [];

        if (branch_id) {
            query += ` WHERE s.branch_id = $1`;
            values.push(branch_id);
        }

        query += ` ORDER BY sp.payment_date DESC`;

        const data = await pool.query(query, values);

        if (data.rowCount === 0) {
            return NextResponse.json({
                success: true,
                message: branch_id ? "No sale payments found for this branch" : "No sale payments found",
                payload: []
            }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully fetched sale payment records',
            payload: data.rows
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}