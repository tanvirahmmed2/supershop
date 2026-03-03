'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { MdOutlineAddShoppingCart } from "react-icons/md";

const Item = ({ product }) => {
    return (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.7 }} className='w-full border cursor-pointer border-black/10 hover:shadow-lg shadow group transition ease-in-out duration-500 relative'>
            <Link href={`/products/${product.slug}`} className='w-full flex items-center gap-1 flex-col p-2  relative '>
                <div className='w-full overflow-hidden'>
                    <Image src={product.image} alt='product image' width={300} height={300} className='w-full group-hover:scale-105 transition ease-in-out duration-500 aspect-square object-cover overflow-hidden ' />

                </div>
                <h1>{product.name.slice(0, 30)}</h1>
                <strong>BDT {product.sale_price - product.discount_price}</strong>

            </Link>
            <button onClick={() => alert(product.product_id)} className='sm:hidden opacity-50 sm:opacity-100 group-hover:block transition ease-in-out duration-300 absolute top-4 right-4 bg-orange-400 text-white text-2xl p-2 rounded-full cursor-pointer'><MdOutlineAddShoppingCart /></button>
        </motion.div>
    )
}

export default Item
