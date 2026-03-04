import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const res= await pool.query('SELECT * FROM products WHERE discount_price > 0 ORDER BY name ASC LIMIT 30')
        if(res.rowCount===0){
            return NextResponse.json({
                success:false, message:'No product found'
            },{status:400})
        }
        return NextResponse.json({
            success:true, message:'Successfully fetched data', payload:res.rows
        },{status:200})
    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
        
    }
    
}