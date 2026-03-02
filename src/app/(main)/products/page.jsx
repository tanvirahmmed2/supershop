
'use client'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'

const ProductsPage = () => {

  const { categories } = useContext(Context)
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [category, setCategory] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/product', {
          params: {
            category: category,
            page: page
          }
        })
        setProducts(res.data.payload)
        setTotalPage(res.data.totalPages)
      } catch (error) {
        console.log(error)
        setProducts([])
      }
    }
    fetchProducts()
  }, [category, page])

  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
    setPage(1)
  }
console.log(categories)
  return (
    <div className='w-full flex flex-col items-center gap-4 p-1 sm:p-4'>
      <select name="category" id="category" onChange={handleCategoryChange} value={category} className='w-full bg-white border border-black/20 cursor-pointer text-black outline-none p-1 text-center'>
        <option value="">select</option>
        {
          categories.length>0 && categories.map((cat)=>(
            <option value={cat.category_id} key={cat.category_id} className='text-black'>{cat.name}</option>
          ))
        }
      </select>

    </div>
  )
}

export default ProductsPage
