'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'



const CategoryCard = ({ category }) => {

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete('/api/category', { data: { id }, withCredentials: true })
            toast.success(res.data.message)
            if (fetchCategories) {
                fetchCategories()
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete category")

        }
    }

    return (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.7 }} className='w-full border cursor-pointer border-black/10 hover:shadow-lg shadow group transition ease-in-out duration-500'>
            <Link href={`/category/${category.slug}`} className='w-full flex items-center gap-4 flex-col p-2 '>
                <div className='w-full overflow-hidden'>
                    <Image src={category.image} alt='category image' width={300} height={300} className='w-full group-hover:scale-105 transition ease-in-out duration-500 aspect-square object-cover overflow-hidden ' />

                </div>
                <h1>{category.name}</h1>
            </Link>

        </motion.div>
    )
}

export default CategoryCard
