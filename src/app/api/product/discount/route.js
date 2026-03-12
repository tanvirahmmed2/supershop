import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await pool.query(`
            SELECT 
                p.*, 
                COALESCE(SUM(i.stock), 0) AS stock
            FROM public.products p
            LEFT JOIN public.inventory i ON p.product_id = i.product_id
            WHERE p.discount_price > 0 
            GROUP BY p.product_id
            ORDER BY p.name ASC 
            LIMIT 30
        `);

        if (res.rowCount === 0) {
            return NextResponse.json({
                success: false, 
                message: 'No product found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true, 
            message: 'Successfully fetched data', 
            payload: res.rows
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false, 
            message: error.message
        }, { status: 500 });
    }
}