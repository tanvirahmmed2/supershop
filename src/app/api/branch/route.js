import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
    try {
        const data = await pool.query(`SELECT * FROM branches ORDER BY location ASC`)
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
        const { name, location, map_url, phone } = await req.json()

        if (!name || !phone || !location || !map_url) {
            return NextResponse.json({
                success: false, message: 'Please provide all information'
            }, { status: 400 })
        }

        const slug = slugify(name, { strict: true, lower: true })

        const existBranch = await pool.query(`SELECT * FROM branches WHERE location=$1`, [location])

        if (existBranch.rowCount !== 0) {
            return NextResponse.json({
                success: false, message: 'Branche already exists'
            }, { status: 400 })
        }

        const newBranch = await pool.query(`INSERT INTO branches(name, slug, location, map_url, phone) VALUES($1,$2,$3,$4,$5) RETURNING name`, [name, slug, location, map_url, phone])


        if (newBranch.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Failed to create branch'
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true, message: 'Successfully created branch'
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

         const existBranch=await pool.query(`SELECT * FROM branches WHERE branch_id=$1`,[id])
         if(existBranch.rowCount===0){
            return NextResponse.json({
                success:false, message:'NO branch found with this id'
            },{status:400})
         }

         await pool.query(`DELETE FROM branches WHERE branch_id=$1`,[id])

         return NextResponse.json({
            success:true, message:'Successfully deleted branch info'
         },{status:200})
    } catch (error) {

        return NextResponse.json({
            success: false, message: error.message
        },{status:500})
    }
    
}