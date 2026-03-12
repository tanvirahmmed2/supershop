import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import { isUserLogin } from "@/lib/usermiddleware";



export async function GET() {
    try {
        const auth= await isUserLogin()
        if(!auth.success){
            return NextResponse.json({
                success:false, message:auth.message
            },{status:400})
        }
        
        
        return NextResponse.json({
            success: true, message: 'Successfully fetched user data', payload: auth.payload
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

        const existUser = await pool.query('SELECT * FROM users WHERE user_id=$1', [id])
        if (existUser.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'No user found with this id'
            }, { status: 400 })
        }
        await pool.query('DELETE FROM users WHERE user_id=$1', [id]);

        return NextResponse.json({
            success: true,
            message: 'User deleted successfully'
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false, message: error, message
        }, { status: 500 })

    }

}

export async function POST(req) {
    try {
        const { name, email, phone, password } = await req.json()

        if (!name || !email || !phone || !password) {
            return NextResponse.json({
                success: false, message: 'Please fill all required data'
            }, { status: 400 })
        }

        const existUser = await pool.query(`SELECT email FROM users WHERE email=$1 OR phone=$2`, [email, phone])
        if (existUser.rowCount > 0) {
            return NextResponse.json({
                success: false, message: 'User already exists with this email or phone'
            }, { status: 400 })
        }

        const hashPass = await bcrypt.hash(password, 10)

        const newUser = await pool.query(
            `INSERT INTO users(name, email, phone, password) VALUES($1, $2, $3, $4) RETURNING user_id`,
            [name, email, phone, hashPass]
        )

        if (newUser.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Failed to create user'
            }, { status: 400 })
        }

        await pool.query(`
            INSERT INTO customers (name, phone, email) 
            VALUES ($1, $2, $3)
            ON CONFLICT (phone) 
            DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email
        `, [name, phone, email]);

        return NextResponse.json({
            success: true, 
            message: 'Successfully created user and synced customer profile', 
        }, { status: 201 })

    } catch (error) {
        console.error("Signup Error:", error.message);
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 })
    }
}


export async function PATCH(req) {
    try {
        const auth = await isUserLogin();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const userId = auth.payload.user_id;
        const currentPhone = auth.payload.phone;
        const { name, email, password } = await req.json();

        if (!name || !email) {
            return NextResponse.json({ success: false, message: 'Name and Email are required' }, { status: 400 });
        }

        let query;
        let values;

        if (password && password.trim() !== "") {
            const hashPass = await bcrypt.hash(password, 10);
            query = `UPDATE users SET name = $1, email = $2, password = $3 WHERE user_id = $4`;
            values = [name, email, hashPass, userId];
        } else {
            query = `UPDATE users SET name = $1, email = $2 WHERE user_id = $3`;
            values = [name, email, userId];
        }

        await pool.query(query, values);

        await pool.query(
            `UPDATE customers SET name = $1, email = $2 WHERE phone = $3`,
            [name, email, currentPhone]
        );

        return NextResponse.json({ success: true, message: 'Profile updated successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}