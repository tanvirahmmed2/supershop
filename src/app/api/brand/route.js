import cloudinary from "@/lib/database/cloudinary";
import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import slugify from "slugify";


export async function GET() {
    try {
        const data = await pool.query(`SELECT * FROM brands ORDER BY name ASC`)
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
        }, { status: 500 })

    }

}

export async function POST(req) {
    try {
        const formData = await req.formData();

        const name = formData.get('name')
        const description = formData.get('description')
        const imageFile = formData.get('image')

        if (!name || !description || !imageFile) {
            return NextResponse.json({
                success: false, message: "Please fill all information"
            })
        }
        const slug = slugify(name, { strict: true, lower: true })

        const existBrand = await pool.query(`SELECT * FROM brands WHERE slug=$1`, [slug])

        if (existBrand.rowCount > 0) {
            return NextResponse.json({
                success: false, message: 'Brand already exists'
            }, { status: 400 })
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "brands" },
                (err, result) => { if (err) reject(err); else resolve(result); }
            );
            stream.end(buffer);
        });

        const newBrand = await pool.query(`INSERT INTO brands(name, slug, logo, logo_id, description) VALUES($1, $2,$3, $4,$5) RETURNING name`, [name, slug, cloudImage.secure_url, cloudImage.public_id, description])
        if (newBrand.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Failed to create brand'
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true, message: 'Successfully created brand data'
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 })

    }

}


export async function DELETE(req) {
    try {
        const {id}= await req.json()
        if(!id){
            return NextResponse.json({
                success:false, message:'Brand id not recieved'
            },{status:400})
        }
        const data=await pool.query(`SELECT * FROM brands WHERE brand_id=$1`,[id])
        if(data.rowCount===0){
            return NextResponse.json({
                success:false, message:"No brand found with this id"
            },{status:400})
        }

        const brand= data.rows[0]
        
        await cloudinary.uploader.destroy(brand.logo_id)

        await pool.query(`DELETE FROM brands WHERE brand_id=$1`,[id])

        return NextResponse.json({
            success:true, message:'Successfully deleted brand'
        },{status:200})

    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
        
    }
    
}
