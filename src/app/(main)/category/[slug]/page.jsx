'use client'
import Item from '@/components/card/Item'
import axios from 'axios'
import React, { use, useEffect, useState } from 'react'

const ProductsPage = ({params}) => {

  const { slug } = use(params)
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`/api/category/${slug}`, {
          params: {
            page: page
          }
        })
        setProducts(res.data.payload)
        setTotalPage(res.data.totalPage) 
      } catch (error) {
        console.log(error)
        setProducts([])
        setTotalPage(1)
      }
    }
    fetchProducts()
  }, [ page, slug])



  return (
    <div className='w-full flex flex-col items-center gap-4 p-1 sm:p-4'>
      
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