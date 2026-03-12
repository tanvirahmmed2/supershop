import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { slug } = await params;
        
        if (!slug) {
            return NextResponse.json({
                success: false, message: 'Slug not found'
            }, { status: 400 });
        }

        const res = await pool.query(`
            SELECT 
                p.product_id,
                p.name,
                p.slug,
                p.sale_price,
                p.description,
                p.image,
                p.category_id,
                p.discount_price,
                p.wholesale_price,
                p.features,
                c.slug AS category_slug, 
                c.name AS category_name,
                COALESCE(SUM(i.stock), 0) AS stock
            FROM public.products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN public.inventory i ON p.product_id = i.product_id
            WHERE p.slug = $1
            GROUP BY p.product_id, c.category_id;
        `, [slug]);

        if (res.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'No data found with this slug'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true, 
            message: 'Successfully fetched data', 
            payload: res.rows[0]
        }, { status: 200 });

    } catch (error) {
        console.error("PRODUCT_BY_SLUG_ERROR:", error.message);
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });
    }
}