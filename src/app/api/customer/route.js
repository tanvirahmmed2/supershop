import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const searchValue = searchParams.get('value') || '';

        let query = `
            SELECT 
                c.customer_id, 
                c.name, 
                c.phone, 
                c.points, 
                c.created_at,
                COUNT(s.sale_id)::integer as total_orders
            FROM public.customers c 
            LEFT JOIN public.sales s ON c.customer_id = s.customer_id
            WHERE c.name ILIKE $1 OR c.phone ILIKE $1
            GROUP BY c.customer_id
            ORDER BY total_orders DESC
            LIMIT 50
        `;

        const values = [`%${searchValue}%`];
        const data = await pool.query(query, values);

        return NextResponse.json({
            success: true,
            message: "Customers fetched successfully",
            payload: data.rows 
        }, { status: 200 });

    } catch (error) {
        console.error("CUSTOMER_FETCH_ERROR:", error.message);
        return NextResponse.json({
            success: false, 
            message: error.message
        }, { status: 500 });
    }
}