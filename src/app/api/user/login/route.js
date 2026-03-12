import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV } from "@/lib/database/secret";
import { isUserLogin } from "@/lib/usermiddleware";


export async function POST(req) {
    try {
        const {email, password}= await req.json()
        if(!email || !password){
            return NextResponse.json({
                success:false, message:'Please fill all data'
            },{status:400})
        }

        const existuser= await pool.query(`SELECT * FROM users WHERE email=$1`,[email])
        if(existuser.rowCount===0){
            return NextResponse.json({
                success:false, message:'No user found with this email'
            },{status:400})
        }
        const user= existuser.rows[0]

        const isMatchPass= await bcrypt.compare(password, user.password)
        if(!isMatchPass){
            return NextResponse.json({
                success:false, message:'Incorrect credentials'
            },{status:400})
        }

        const payload={
            id: user.user_id,
            email:user.email,
            phone:user.phone
        }

        const token= jwt.sign(
            payload, JWT_SECRET,{expiresIn: '7d'}
        )

        const res= NextResponse.json({
            success:true, message:'Successfully logged in'
        },{status:200})

        res.cookies.set('supershop_user', token,{
            httpOnly:true,
            secure:NODE_ENV,
            sameSite:'lax',
            path:'/',
            maxAge:60*60*24*7
        })

        return res

    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
        
    }
    
}


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


