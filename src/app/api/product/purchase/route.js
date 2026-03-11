import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const searchTerm = searchParams.get('q');

        if (!searchTerm || searchTerm.trim().length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No search term provided',
                payload: []
            }, { status: 400 });
        }

        let query = `
            SELECT 
                p.*, 
                c.name as category_name,
                COALESCE(SUM(i.stock), 0) as stock
            FROM public.products p
            LEFT JOIN public.categories c ON p.category_id = c.category_id
            LEFT JOIN public.inventory i ON p.product_id = i.product_id
            WHERE p.name ILIKE $1 
               OR p.barcode ILIKE $1 
               OR c.name ILIKE $1
            GROUP BY p.product_id, c.name 
            ORDER BY p.name ASC 
            LIMIT 10
        `;

        const queryValues = [`%${searchTerm}%`];
        const data = await pool.query(query, queryValues);

        if (data.rowCount === 0) {
            return NextResponse.json({
                success: false,
                message: 'No matching products found',
                payload: []
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Products fetched successfully",
            payload: data.rows
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}