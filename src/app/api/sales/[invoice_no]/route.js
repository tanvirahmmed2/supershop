import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { invoice_no } = await params;

        if (!invoice_no) {
            return NextResponse.json({
                success: false, message: 'Invoice number is required'
            }, { status: 400 });
        }

        const saleQuery = `
            SELECT 
                s.*, 
                c.name as customer_name, c.phone as customer_phone, c.address as customer_address, c.points as customer_points,
                st.name as staff_name,
                b.name as branch_name, b.location as branch_location, b.phone as branch_phone
            FROM sales s
            LEFT JOIN customers c ON s.customer_id = c.customer_id
            JOIN staffs st ON s.staff_id = st.staff_id
            JOIN branches b ON s.branch_id = b.branch_id
            WHERE s.invoice_no = $1
        `;

        const saleData = await pool.query(saleQuery, [invoice_no]);

        if (saleData.rowCount === 0) {
            return NextResponse.json({
                success: false, message: "Sale record not found"
            }, { status: 404 });
        }

        const sale = saleData.rows;

        const itemsQuery = `
            SELECT 
                sp.*, 
                p.name as product_name, 
                p.barcode,
                p.unit -- e.g., 'kg', 'pcs'
            FROM sale_products sp
            JOIN products p ON sp.product_id = p.product_id
            WHERE sp.sale_id = $1
        `;

        const itemsData = await pool.query(itemsQuery, [sale.sale_id]);

        const paymentsData = await pool.query(
            'SELECT * FROM sale_payments WHERE sale_id = $1 ORDER BY payment_date DESC',
            [sale.sale_id]
        );

        return NextResponse.json({
            success: true,
            message: 'Successfully fetched sale details',
            payload: {
                ...sale,
                items: itemsData.rows,
                payments: paymentsData.rows
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });
    }
}