import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const res = await pool.query(`SELECT 
        p.*, 
        SUM(sp.quantity) AS quantity
        FROM products p
        JOIN sale_products sp ON p.product_id = sp.sale_item_id
        GROUP BY p.product_id
        ORDER BY quantity DESC
        LIMIT 10;
        `)

        if (res.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'No data found'
            }, { status: 400 })
        }
        return NextResponse.json({
            success: true, message: 'Successfully fetched data', payload: res.rows
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 })

    }

}