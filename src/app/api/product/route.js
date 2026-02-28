import cloudinary from "@/lib/database/cloudinary";
import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
    try {
        const data = await pool.query(`SELECT * FROM products ORDER BY name ASC`)
        if (data.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'No product fround'
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true, message: "Successfully fetched data", payload: data.rows
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 })

    }

}

export async function POST(req) {
    try {
        const formData = await req.formData()
        const name = formData.get('name')
        const description = formData.get('description')
        const barcode = formData.get('barcode')
        const imageFile = formData.get('image')
        const features = formData.get('features')
        const purchase_price = Number(formData.get('purchase_price'))
        const sale_price = Number(formData.get('sale_price'))
        const retail_price = Number(formData.get('retail_price'))
        const dealer_price = Number(formData.get('dealer_price'))
        const discount_price = Number(formData.get('discount_price'))
        const wholesale_price = Number(formData.get('wholesale_price'))
        const category_id = formData.get('category_id')
        const brand_id = formData.get('brand_id')

        if (!name || !description || !purchase_price || !sale_price || !category_id || !imageFile) {
            return NextResponse.json({
                success: false, message: "Enough resource not found"
            }, { status: 400 })
        }

        const slug = slugify(name, { strict: true, lower: true })

        const existProduct = await pool.query(`SELECT product_id FROM products WHERE slug=$1 OR barcode=$2`, [slug, barcode])
        if (existProduct.rowCount !== 0) {
            return NextResponse.json({
                success: false, message: 'Product already exists'
            }, { status: 400 })
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "ss-products" },
                (err, result) => { if (err) reject(err); else resolve(result); }
            );
            stream.end(buffer);
        });

        const featuresArr = features ? features.split(',').map(t => t.trim()) : []
        const newProduct = await pool.query(`INSERT INTO products(name, slug, description, features, barcode, purchase_price, sale_Price, retail_price, wholesale_price, dealer_price,discount_price, category_id, brand_id, image, image_id) VALUES($1, $2, $3,$4,$5,$6,$7,$8,$9,$10, $11, $12,$13, $14,$15) RETURNING name`, [name, slug, description, featuresArr, barcode, purchase_price, sale_price, retail_price, wholesale_price, dealer_price, discount_price, category_id, brand_id, cloudImage.secure_url, cloudImage.public_id])

        if (newProduct.rowCount === 0) {
            return NextResponse.json({
                success: false, message: "Failed to add product"
            }, { status: 400 })
        }
        return NextResponse.json({
            success: true, message: 'Successfully created product'
        }, { status: 200 })
    } catch (error) {

        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 })

    }
}