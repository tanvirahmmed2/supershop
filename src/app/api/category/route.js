import cloudinary from "@/lib/database/cloudinary";
import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import slugify from "slugify";


export async function GET() {
    try {
        const data = await pool.query(`SELECT * FROM categories ORDER BY name ASC`)
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
        const imageFile = formData.get('image')

        if (!name || !imageFile) {
            return NextResponse.json({
                success: false, message: "Please fill all information"
            })
        }
        const slug = slugify(name, { strict: true, lower: true })

        const existCategory = await pool.query(`SELECT * FROM categories WHERE slug=$1`, [slug])

        if (existCategory.rowCount > 0) {
            return NextResponse.json({
                success: false, message: 'Category already exists'
            }, { status: 400 })
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "categories" },
                (err, result) => { if (err) reject(err); else resolve(result); }
            );
            stream.end(buffer);
        });

        const newCategory = await pool.query(`INSERT INTO categories(name, slug, image, image_id) VALUES($1, $2,$3, $4) RETURNING name`, [name, slug, cloudImage.secure_url, cloudImage.public_id])
        if (newCategory.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Failed to create Category'
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true, message: 'Successfully created Category data'
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
                success:false, message:'Category id not recieved'
            },{status:400})
        }
        const data=await pool.query(`SELECT * FROM categories WHERE category_id=$1`,[id])
        if(data.rowCount===0){
            return NextResponse.json({
                success:false, message:"No Category found with this id"
            },{status:400})
        }

        const Category= data.rows[0]
        
        await cloudinary.uploader.destroy(Category.image_id)

        await pool.query(`DELETE FROM categories WHERE category_id=$1`,[id])

        return NextResponse.json({
            success:true, message:'Successfully deleted Category'
        },{status:200})

    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
        
    }
    
}
