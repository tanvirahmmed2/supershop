'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Item from '../card/Item'

const SameCategoryProduct = ({ slug }) => {
    const [products, setProducts] = useState([])
    useEffect(() => {
        const fecthProducts = async () => {
            try {
                const res = await axios.get(`/api/category/${slug}`, { withCredentials: true })
                setProducts(res.data.payload)
            } catch (error) {
                setProducts([])

            }
        }
        fecthProducts()
    }, [slug])
    return (
        <div className='w-full flex flex-col items-center justify-center gap-4'>
            {
                products.length > 0 && (
                    <div className='w-full flex flex-col items-center gap-6'>
                        <div className='w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4'>
                            {
                                products.slice(0,8).map((product) => (
                                    <Item key={product.product_id} product={product} />
                                ))
                            }
                        </div>
                    </div>
                )}
        </div>
    )
}

export default SameCategoryProduct
