import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { name, email, subject, note } = await req.json();

        if (!name || !email || !note) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
        }

        const query = `
            INSERT INTO support_tickets (name, email, subject, note)
            VALUES ($1, $2, $3, $4) RETURNING ticket_id
        `;
        const res = await pool.query(query, [name, email, subject, note]);

        return NextResponse.json({ 
            success: true, 
            message: "Ticket created", 
            id: res.rows.ticket_id 
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}


export async function GET() {
    try {
        const query = `SELECT * FROM support_tickets ORDER BY created_at DESC`;
        const data = await pool.query(query);

        return NextResponse.json({
            success: true,
            payload: data.rows
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;

        const res = await pool.query(
            "DELETE FROM support_tickets WHERE ticket_id = $1", 
            [id]
        );

        if (res.rowCount === 0) {
            return NextResponse.json({ success: false, message: "Ticket not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Ticket deleted" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}