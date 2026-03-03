'use client'
import axios from 'axios'
import React, { use, useEffect, useState } from 'react'

const CategoryProducts = ({ params }) => {
    const { slug } = use(params)

    const [products, setProducts] = useState([])
    const [page, setPages] = useState(1)
    const [totalPage, setTotalPage] = useState(1)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`/api/category/${slug}`, {
                    params: { page: page }
                })
                setProducts(res.data.payload)
                setTotalPage(res.data.totalPage)
            } catch (error) {
                console.log(error)
                setProducts([])

            }
        }
        fetchProducts()
    }, [slug, page])


    return (
        <div className='w-full flex flex-col items-center gap-4 '>
            {
                products.length>0? <div>
                    
                </div>:<p>No data found</p>
            }
        </div>
    )
}

export default CategoryProducts
