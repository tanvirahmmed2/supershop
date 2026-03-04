'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { MdOutlineAddShoppingCart } from "react-icons/md";

const Item = ({ product }) => {
    return (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.7 }} className='w-full border flex flex-col items-center justify-between cursor-pointer border-black/10 hover:shadow-lg shadow group overflow-hidden transition ease-in-out duration-500 relative'>
            <Link href={`/products/${product.slug}`} className='w-full flex items-center gap-1 flex-col p-2  relative '>
                <div className='w-full overflow-hidden'>
                    <Image src={product.image} alt='product image' width={300} height={300} className='w-full group-hover:scale-105 transition ease-in-out duration-500 aspect-square object-cover overflow-hidden ' />

                </div>
                <h1>{product.name.slice(0, 30)}</h1>
                <strong>BDT {product.sale_price - product.discount_price}</strong>

            </Link>
           {product.discount_price>0 && <p className='bg-orange-400 text-white px-2 rounded-2xl absolute z-10 top-2 right-2 text-xs uppercase'>Save BDT {product.discount_price.split('.')[0]}</p>}
            <button onClick={() => alert(product.product_id)} className='w-full sm:absolute z-10 bottom-0 sm:p-1 transition ease-in-out duration-500 bg-orange-400 text-white transform group-hover:translate-y-0 translate-y-0 sm:translate-y-full'>Add to cart</button>
            
        </motion.div>
    )
}

export default Item
