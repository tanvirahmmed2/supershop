import { pool } from "@/lib/database/db";
import { isISales } from "@/lib/middleware";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } =await params; 
        const auth = await isISales();
        if (!auth.success) return NextResponse.json({ success: false, message:auth.message }, { status: 401 });

        const saleQuery = await pool.query(`
            SELECT s.*, c.name as customer_name, c.phone as customer_phone, c.address as customer_address, b.name as branch_name
            FROM sales s
            LEFT JOIN customers c ON s.customer_id = c.customer_id
            LEFT JOIN branches b ON s.branch_id = b.branch_id
            WHERE s.invoice_no = $1
        `, [id]);

        if (saleQuery.rowCount === 0) {
            return NextResponse.json({ success: false, message: "Invoice not found" }, { status: 404 });
        }

        const sale = saleQuery.rows[0];

        const itemsQuery = await pool.query(`
            SELECT sp.*, p.name as product_name
            FROM sale_products sp
            JOIN products p ON sp.product_id = p.product_id
            WHERE sp.sale_id = $1
        `, [sale.sale_id]);

        const payload = {
            ...sale,
            items: itemsQuery.rows
        };

        return NextResponse.json({ success: true, payload });

    } catch (e) {
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}