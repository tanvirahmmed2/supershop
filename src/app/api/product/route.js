import cloudinary from "@/lib/database/cloudinary";
import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url); 
        const category_id = searchParams.get('category_id');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        let query = `SELECT * FROM products`;
        let countQuery = `SELECT COUNT(*) FROM products`; // Fixed typo 'SLECT'
        let values = [];

        if (category_id && category_id !== '') {
            query += ` WHERE category_id = $1`; // Added space before WHERE
            countQuery += ` WHERE category_id = $1`;
            values.push(category_id);
        }

        const totalRes = await pool.query(countQuery, values);
        const totalItems = parseInt(totalRes.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit) || 1;

        // Correct parameter indexing for LIMIT and OFFSET
        query += ` ORDER BY name ASC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        
        // Construct the final array for the query
        const finalValues = [...values, limit, offset];

        const data = await pool.query(query, finalValues);
      
        if (data.rowCount === 0) {
            return NextResponse.json({
                success: false, 
                message: 'No products found'
            }, { status: 404 }); // 404 is more appropriate for 'not found'
        }

        return NextResponse.json({
            success: true, 
            message: "Successfully fetched data", 
            payload: data.rows, 
            totalPage: totalPages,
            currentPage: page
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false, 
            message: error.message
        }, { status: 500 });
    }
}


export async function POST(req) {
    try {
        const formData = await req.formData();
        
        const name = formData.get('name');
        const description = formData.get('description');
        const imageFile = formData.get('image');
        const category_id = formData.get('category_id');
        const features = formData.get('features');
        const brand_id = formData.get('brand_id') || null;

        let barcode = formData.get('barcode');

        if (!barcode || barcode.trim() === "") {
            const lastBarcodeRes = await pool.query(
                `SELECT MAX(CAST(barcode AS BIGINT)) as max_bc FROM products WHERE barcode ~ '^[0-9]+$'`
            );
            const lastBarcode = lastBarcodeRes.rows[0].max_bc;
            barcode = lastBarcode ? (BigInt(lastBarcode) + 1n).toString() : "10001";
        }

        const purchase_price = Number(formData.get('purchase_price')) || 0;
        const sale_price = Number(formData.get('sale_price')) || 0;
        const retail_price = Number(formData.get('retail_price')) || 0;
        const dealer_price = Number(formData.get('dealer_price')) || 0;
        const discount_price = Number(formData.get('discount_price')) || 0;
        const wholesale_price = Number(formData.get('wholesale_price')) || 0;

        if (!name || !description || !purchase_price || !sale_price || !category_id || !imageFile) {
            return NextResponse.json({
                success: false, message: "Required fields missing"
            }, { status: 400 });
        }

        const slug = slugify(name, { strict: true, lower: true });

        const existProduct = await pool.query(
            `SELECT product_id FROM products WHERE slug=$1 OR barcode=$2`, 
            [slug, barcode]
        );

        if (existProduct.rowCount > 0) {
            return NextResponse.json({
                success: false, message: 'Product or Barcode already exists'
            }, { status: 400 });
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "ss-products" },
                (err, result) => { if (err) reject(err); else resolve(result); }
            );
            stream.end(buffer);
        });

        const featuresArr = features ? features.split(',').map(t => t.trim()).filter(t => t !== "") : [];

        const query = `
            INSERT INTO products(
                name, slug, description, features, barcode, 
                purchase_price, sale_price, retail_price, wholesale_price, 
                dealer_price, discount_price, category_id, brand_id, 
                image, image_id
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
            RETURNING barcode;
        `;

        const values = [
            name, slug, description, featuresArr, barcode,
            purchase_price, sale_price, retail_price, wholesale_price,
            dealer_price, discount_price, category_id, brand_id,
            cloudImage.secure_url, cloudImage.public_id
        ];

        const result = await pool.query(query, values);

        return NextResponse.json({
            success: true, 
            message: `Product created with barcode: ${result.rows[0].barcode}`
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const {id}= await req.json()
        if(!id){
            return NextResponse.json({
                success:false, message:'product id not recieved'
            },{status:400})
        }
        const data= await pool.query(`SELECT * FROM product WHERE product_id=$1`,[id])
        if(data.rowCount===0){
            return NextResponse.json({
                success:false, message:'No product found with this id'
            },{status:400})
        }

        const product= data.rows[0]

        await cloudinary.uploader.destroy(product.image_id)
        await pool.query(`DELETE FROM product WHERE product_id=$1`,[id])

        return NextResponse.json({
            success:true, message:'Succesfully deleted product'
        },{status:200})
    } catch (error) {
        return NextResponse.json({
            success:false , message:error.message
        },{status:500})
        
    }
    
}