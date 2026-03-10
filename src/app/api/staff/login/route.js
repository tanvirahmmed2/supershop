import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV } from "@/lib/database/secret";
import { isStaff } from "@/lib/middleware";


export async function POST(req) {
    try {
        const {email, password}= await req.json()
        if(!email || !password){
            return NextResponse.json({
                success:false, message:'Please fill all data'
            },{status:400})
        }

        const existStaff= await pool.query(`SELECT * FROM staffs WHERE email=$1`,[email])
        if(existStaff.rowCount===0){
            return NextResponse.json({
                success:false, message:'No staff found with this email'
            },{status:400})
        }
        const staff= existStaff.rows[0]

        const isMatchPass= await bcrypt.compare(password, staff.password)
        if(!isMatchPass){
            return NextResponse.json({
                success:false, message:'Incorrect credentials'
            },{status:400})
        }

        const payload={
            id: staff.staff_id,
            email:staff.email,
            role:staff.role,
            branch_id:staff.branch_id
        }

        const token= jwt.sign(
            payload, JWT_SECRET,{expiresIn: '7d'}
        )

        const res= NextResponse.json({
            success:true, message:'Successfully logged in'
        },{status:200})

        res.cookies.set('supershop_staff', token,{
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
        const auth=await isStaff()
        if(!auth.success){
            return NextResponse.json({
                success:false, message:auth.message
            },{status:400})
        }
        const data=auth.payload

        const staffData= await pool.query('SELECT s.name, s.role, s.staff_id,s.email,b.location AS branch_location, b.name AS branch_name, b.branch_id AS branch_id FROM staffs s LEFT JOIN branches b ON s.branch_id = b.branch_id WHERE staff_id=$1',[data.staff_id])
        if(staffData.rowCount===0){
            return NextResponse.json({
                success:false, message:'Info not found'
            })
        }
        const payload=staffData.rows[0]

        return NextResponse.json({
            success:true, message:'Login verified',payload:payload
        })
    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
        
    }
    
}