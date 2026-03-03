'use client'
import Item from '@/components/card/Item'
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
            category_id: category,
            page: page
          }
        })
        setProducts(res.data.payload)
        // Fixed: Matching the key from your API (totalPage)
        setTotalPage(res.data.totalPage) 
      } catch (error) {
        console.log(error)
        setProducts([])
        setTotalPage(1)
      }
    }
    fetchProducts()
  }, [category, page])

  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
    setPage(1) // Reset to first page on category change
  }

  return (
    <div className='w-full flex flex-col items-center gap-4 p-1 sm:p-4'>
      <select name="category" id="category" onChange={handleCategoryChange} value={category} className='w-full bg-white border border-black/20 cursor-pointer text-black outline-none p-1 text-center'>
        <option value="">select</option>
        {
          categories.length > 0 && categories.map((cat) => (
            <option value={cat.category_id} key={cat.category_id} className='text-black'>{cat.name}</option>
          ))
        }
      </select>
      
      {
        products.length > 0 ? (
          <div className='w-full flex flex-col items-center gap-6'>
            <div className='w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4'>
              {
                products.map((product) => (
                  <Item key={product.product_id} product={product} />
                ))
              }
            </div>
            
            <div className='w-full flex flex-row items-center justify-center gap-4'>
              <button 
                disabled={page === 1} 
                onClick={() => setPage(page - 1)} 
                className='px-4 cursor-pointer bg-orange-400 text-white rounded-2xl p-1 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Prev
              </button>

              <span className="text-sm font-bold">Page {page} of {totalPage}</span>

              <button 
                disabled={page === totalPage} 
                onClick={() => setPage(page + 1)} 
                className='px-4 cursor-pointer bg-orange-400 text-white rounded-2xl p-1 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p>No data found</p>
        )
      }
    </div>
  )
}

export default ProductsPage