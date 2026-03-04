import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import { sendEmail } from "@/lib/database/brevo";



// export async function GET() {
//     try {
//         const data = await pool.query('SELECT * FROM users ORDER BY role ASC')
//         if (data.rowCount === 0) {
//             return NextResponse.json({
//                 success: false, message: "No user found"
//             }, { status: 400 })
//         }

//         return NextResponse.json({
//             success: true, message: 'Successfully fetched user data', payload: data.rows
//         }, { status: 200 })
//     } catch (error) {
//         return NextResponse.json({
//             success: false, message: error.message
//         }, { status: 500 })

//     }

// }

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

        

        const existUser = await pool.query(`SELECT * FROM users WHERE email=$1 OR phone=$2`, [email, phone])
        if (existUser.rowCount > 0) {
            return NextResponse.json({
                success: false, message: 'User already exists with this email or phone'
            }, { status: 400 })
        }

        const hashPass = await bcrypt.hash(password, 10)

        const newUser = await pool.query(
            `INSERT INTO users(name, email, phone, password) VALUES($1, $2, $3, $4) RETURNING name`,
            [name, email, phone, hashPass]
        )

        if (newUser.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Failed to create user'
            }, { status: 400 })
        }
        return NextResponse.json({
            success: true, 
            message: 'Successfully created user and sent credentials email', 
        }, { status: 201 })

    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 })
    }
}