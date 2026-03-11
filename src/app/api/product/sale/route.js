import { pool } from "@/lib/database/db";
import { isStaff } from "@/lib/middleware";
import { NextResponse } from "next/server";
export async function GET(req) {
    try {
        const auth = await isStaff();
        if (!auth.success) {
            return NextResponse.json({
                success: false, message: 'Unauthorized'
            }, { status: 401 });
        }

        const branch_id = auth.payload.branch_id;
        const { searchParams } = new URL(req.url);
        const searchTerm = searchParams.get('q');

        if (!searchTerm) {
            return NextResponse.json({ success: false, payload: [] }, { status: 400 });
        }

        const query = `
            SELECT 
                p.*, 
                c.name as category_name,
                COALESCE(i.stock, 0) as stock
            FROM public.products p
            LEFT JOIN public.categories c ON p.category_id = c.category_id
            LEFT JOIN public.inventory i ON p.product_id = i.product_id AND i.branch_id = $2
            WHERE (p.name ILIKE $1 
               OR p.barcode ILIKE $1 
               OR c.name ILIKE $1)
            ORDER BY p.name ASC 
            LIMIT 15
        `;

        const queryValues = [`%${searchTerm}%`, branch_id];
        const data = await pool.query(query, queryValues);

        return NextResponse.json({
            success: true,
            payload: data.rows
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}