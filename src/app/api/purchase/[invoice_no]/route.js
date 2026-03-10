import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { invoice_no } = await params;

        if (!invoice_no) {
            return NextResponse.json({
                success: false, message: 'Invoice number not found'
            }, { status: 400 });
        }

        const purchaseQuery = `
            SELECT 
                p.*, 
                s.name as supplier_name, s.email as supplier_email, s.phone as supplier_phone,
                st.name as staff_name, st.role,
                b.name as branch_name, b.location as branch_location, b.phone as branch_phone
            FROM purchases p
            LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
            LEFT JOIN staffs st ON p.staff_id = st.staff_id
            LEFT JOIN branches b ON p.branch_id = b.branch_id
            WHERE p.invoice_no = $1
        `;

        const purchaseData = await pool.query(purchaseQuery, [invoice_no]);

        if (purchaseData.rowCount === 0) {
            return NextResponse.json({
                success: false, message: "Invoice not found"
            }, { status: 404 });
        }

        const purchase = purchaseData.rows[0];

        const itemsQuery = `
            SELECT 
                pi.*, 
                prod.name as product_name, 
                prod.barcode
            FROM purchase_items pi
            JOIN products prod ON pi.product_id = prod.product_id
            WHERE pi.purchase_id = $1
        `;

        const itemsData = await pool.query(itemsQuery, [purchase.purchase_id]);

        const paymentsData = await pool.query(
            'SELECT * FROM purchase_payments WHERE purchase_id = $1 ORDER BY payment_date DESC',
            [purchase.purchase_id]
        );

        return NextResponse.json({
            success: true,
            message: 'Successfully fetched invoice details',
            payload: {
                ...purchase,
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