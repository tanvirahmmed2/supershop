import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { email, otp, new_password } = await req.json();

        if (!email || !otp || !new_password) {
            return NextResponse.json({ 
                success: false, 
                message: "Email, OTP, and new password are required" 
            }, { status: 400 });
        }

        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1 AND password_otp = $2 AND otp_expires_at > CURRENT_TIMESTAMP",
            [email, otp]
        );

        if (user.rowCount === 0) {
            return NextResponse.json({ 
                success: false, 
                message: "Invalid or expired OTP" 
            }, { status: 400 });
        }

        // 3. Hash the password (Fixed variable name from newPassword to new_password)
        const hashed = await bcrypt.hash(new_password, 10);

        // 4. Update password and CLEAR the OTP so it can't be used again
        await pool.query(
            "UPDATE staffs SET password = $1, password_otp = NULL, otp_expires_at = NULL WHERE email = $2",
            [hashed, email]
        );

        return NextResponse.json({ 
            success: true, 
            message: "Password updated successfully" 
        });

    } catch (error) {
        console.error("Reset Password Error:", error.message);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}