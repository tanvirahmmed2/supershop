import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import { sendEmail } from "@/lib/database/brevo";



export async function GET() {
    try {
        const data = await pool.query('SELECT * FROM staffs ORDER BY role ASC')
        if (data.rowCount === 0) {
            return NextResponse.json({
                success: false, message: "No staff found"
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true, message: 'Successfully fetched staff data', payload: data.rows
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 })

    }

}

export async function DELETE(req) {
    try {
        const { id } = await req.json()
        if (!id) {
            return NextResponse.json({
                success: false, message: 'Id not recieved'
            }, { status: 400 })
        }

        const existStaff = await pool.query('SELECT * FROM staffs WHERE staff_id=$1', [id])
        if (existStaff.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'No staff found with this id'
            }, { status: 400 })
        }

        const staff = existStaff.rows[0];

        if (staff.role === 'manager') {
            const managerCountRes = await pool.query("SELECT COUNT(*) FROM staffs WHERE role='manager'");
            const totalManagers = parseInt(managerCountRes.rows[0].count);

            if (totalManagers <= 1) {
                return NextResponse.json({
                    success: false,
                    message: 'Action denied. You must have at least one manager in the system.'
                }, { status: 403 });
            }
        }

        await pool.query('DELETE FROM staffs WHERE staff_id=$1', [id]);

        return NextResponse.json({
            success: true,
            message: 'Staff deleted successfully'
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false, message: error, message
        }, { status: 500 })

    }

}

export async function POST(req) {
    try {
        const { name, email, branch_id, role, phone, password } = await req.json()

        if (!name || !email || !role || !phone || !password) {
            return NextResponse.json({
                success: false, message: 'Please fill all required data'
            }, { status: 400 })
        }

        if (role !== 'manager' && !branch_id) {
            return NextResponse.json({
                success: false, message: 'Please select branch'
            }, { status: 400 })
        }

        const existStaff = await pool.query(`SELECT * FROM staffs WHERE email=$1 OR phone=$2`, [email, phone])
        if (existStaff.rowCount > 0) {
            return NextResponse.json({
                success: false, message: 'Staff already exists with this email or phone'
            }, { status: 400 })
        }

        const hashPas = await bcrypt.hash(password, 10)
        const finalBranchId = role === 'manager' ? null : branch_id;

        const newStaff = await pool.query(
            `INSERT INTO staffs(name, role, email, phone, password, branch_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING name`,
            [name, role, email, phone, hashPas, finalBranchId]
        )

        if (newStaff.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Failed to create staff'
            }, { status: 400 })
        }

        const emailContent = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                <h2>Welcome to the team, ${name}!</h2>
                <p>Your staff account has been created successfully. Use the credentials below to log in:</p>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Password:</strong> ${password}</p>
                    <p><strong>Role:</strong> ${role.toUpperCase()}</p>
                </div>
                <p style="margin-top: 20px; color: #666;">Please change your password after your first login for security.</p>
            </div>
        `;

        const emailResult = await sendEmail({
            toEmail: email,
            toName: name,
            subject: "Your Staff Account Credentials",
            htmlContent: emailContent
        });

        if (!emailResult.success) {
            console.error("Staff created but email failed:", emailResult.error);
            return NextResponse.json({
                success: true, 
                message: 'Staff created, but failed to send welcome email.'
            }, { status: 201 });
        }
       
        return NextResponse.json({
            success: true, 
            message: 'Successfully created staff and sent credentials email', 
        }, { status: 201 })

    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 })
    }
}