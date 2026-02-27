import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
    try {
        const data = await pool.query(`SELECT * FROM suppliers ORDER BY name ASC`)
        if (data.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'No data found'
            }, { status: 400 })
        }
        return NextResponse.json({
            success: true, message: 'Successfully fetched data', payload: data.rows
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        },{status:500})

    }

}

export async function POST(req) {
    try {
        const { name,  phone, email, address, company_tin } = await req.json()

        if (!name || !phone || !email) {
            return NextResponse.json({
                success: false, message: 'Please provide all information'
            }, { status: 400 })
        }


        const existsupplier = await pool.query(`SELECT * FROM suppliers WHERE phone=$1 OR email=$2`, [phone, email])

        if (existsupplier.rowCount !== 0) {
            return NextResponse.json({
                success: false, message: 'Supplier already exists'
            }, { status: 400 })
        }

        const newsupplier = await pool.query(`INSERT INTO suppliers(name,  phone, email, address, company_tin) VALUES($1,$2,$3,$4,$5) RETURNING name`, [name, phone, email, address, company_tin])


        if (newsupplier.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Failed to create supplier'
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true, message: 'Successfully created supplier'
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        },{status:500})

    }

}

export async function DELETE(req) {
    try {
         const {id}= await req.json()
         if(!id){
            return NextResponse.json({
                success:false, message:'Id not found'
            },{status:400})
         }

         const existSupplier=await pool.query(`SELECT * FROM suppliers WHERE supplier_id=$1`,[id])
         if(existSupplier.rowCount===0){
            return NextResponse.json({
                success:false, message:'NO supplier found with this id'
            },{status:400})
         }

         await pool.query(`DELETE FROM suppliers WHERE supplier_id=$1`,[id])

         return NextResponse.json({
            success:true, message:'Successfully deleted supplier info'
         },{status:200})
    } catch (error) {

        return NextResponse.json({
            success: false, message: error.message
        },{status:500})
    }
    
}