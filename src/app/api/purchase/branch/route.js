import { pool } from "@/lib/database/db";
import { isStaff } from "@/lib/middleware";
import { NextResponse } from "next/server";

export async function GET() {
    try {

        const auth= await isStaff()
        if(!auth.success){
            return NextResponse.json({
                success:false, message:'Please login'
            },{status:400})
        }
        const staff= auth.payload
        const branch_id= staff.branch_id
        if(!branch_id){
            return NextResponse.json({
                success:false, message:'Branch id not found'
            },{status:400})
        }

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