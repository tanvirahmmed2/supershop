'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const Item = ({product}) => {
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.7 }} className='w-full border cursor-pointer border-black/10 hover:shadow-lg shadow group transition ease-in-out duration-500'>
            <Link href={`/products/${product.slug}`} className='w-full flex items-center gap-4 flex-col p-2 '>
                <div className='w-full overflow-hidden'>
                    <Image src={product.image} alt='product image' width={300} height={300} className='w-full group-hover:scale-105 transition ease-in-out duration-500 aspect-square object-cover overflow-hidden ' />

                </div>
                <h1>{product.name}</h1>
            </Link>

        </motion.div>
  )
}

export default Item
