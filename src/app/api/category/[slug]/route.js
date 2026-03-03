import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { slug } = await params;
        
        const { searchParams } = new URL(req.url); 
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        const countQuery = `
            SELECT COUNT(*) 
            FROM products p
            INNER JOIN categories c ON p.category_id = c.category_id
            WHERE c.slug = $1
        `;
        const totalRes = await pool.query(countQuery, [slug]);
        const totalItems = parseInt(totalRes.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit) || 1;

        const query = `
            SELECT p.* 
            FROM products p
            INNER JOIN categories c ON p.category_id = c.category_id
            WHERE c.slug = $1 
            ORDER BY p.product_id DESC 
            LIMIT $2 OFFSET $3
        `;

        const data = await pool.query(query, [slug, limit, offset]);
      
        return NextResponse.json({
            success: true,
            message:'Successfully fetched data', 
            payload: data.rows, 
            totalPages: totalPages,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false, 
            message: error.message
        }, { status: 500 });
    }
}