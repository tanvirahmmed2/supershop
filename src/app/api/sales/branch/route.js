import { pool } from "@/lib/database/db";
import { isStaff } from "@/lib/middleware";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const auth = await isStaff();
        if (!auth.success) {
            return NextResponse.json({
                success: false, message: 'Please login'
            }, { status: 401 });
        }

        const staff = auth.payload;
        const branch_id = staff.branch_id;

        if (!branch_id) {
            return NextResponse.json({
                success: false, message: 'Branch ID not found'
            }, { status: 400 });
        }

        let query = `
            SELECT 
                s.*, 
                c.name as customer_name, 
                c.phone as customer_phone,
                st.name as staff_name,
                b.name as branch_name
            FROM sales s
            LEFT JOIN customers c ON s.customer_id = c.customer_id
            JOIN staffs st ON s.staff_id = st.staff_id
            JOIN branches b ON s.branch_id = b.branch_id
            WHERE s.branch_id = $1
            ORDER BY s.created_at DESC
        `;

        const data = await pool.query(query, [branch_id]);

        return NextResponse.json({
            success: true,
            message: 'Sales history fetched successfully',
            payload: data.rows
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false, 
            message: error.message
        }, { status: 500 });
    }
}