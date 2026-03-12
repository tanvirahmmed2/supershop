import { pool } from "@/lib/database/db";
import { isUserLogin } from "@/lib/usermiddleware";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const auth = await isUserLogin();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const userId = auth.payload.user_id;

        const query = `
            SELECT 
                s.invoice_no, 
                s.sale_id,
                s.total_amount,
                s.discount_amount,
                s.grand_total,
                s.created_at,
                c.name as customer_name,
                c.phone as customer_phone,
                b.name as branch_name,
                b.location as branch_location,
                b.phone as branch_phone,
                st.name as staff_name,
                -- Get payment method from sale_payments table
                (SELECT payment_method FROM sale_payments WHERE sale_id = s.sale_id LIMIT 1) as payment_method,
                -- Aggregate items from sale_products table
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'product_name', p.name, 
                        'quantity', sp.quantity,
                        'unit_price', sp.unit_price
                    )
                ) AS items
            FROM users u
            JOIN customers c ON u.phone = c.phone
            JOIN sales s ON c.customer_id = s.customer_id
            JOIN branches b ON s.branch_id = b.branch_id
            JOIN staffs st ON s.staff_id = st.staff_id
            JOIN sale_products sp ON s.sale_id = sp.sale_id
            JOIN products p ON sp.product_id = p.product_id
            WHERE u.user_id = $1
            GROUP BY 
                s.sale_id, s.invoice_no, c.name, c.phone, b.name, b.location, b.phone, st.name
            ORDER BY s.created_at DESC
        `;

        const res = await pool.query(query, [userId]);

        return NextResponse.json({ 
            success: true, 
            payload: res.rows 
        });

    } catch (error) {
        console.error("USER_GET_ORDERS_ERROR:", error.message);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}