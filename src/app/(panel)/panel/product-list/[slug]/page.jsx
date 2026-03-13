'use client'
import UpdateProductForm from '@/components/forms/UpdateProductForm'
import axios from 'axios'
import React, { use, useEffect, useState } from 'react'

const SlugProductPage = ({ params }) => {
  // Unwrap params using React.use()
  const { slug } = use(params)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`/api/product/${slug}`, { withCredentials: true })
        setProduct(res.data.payload)
      } catch (error) {
        console.error("Error fetching product:", error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    
    if (slug) fetchProduct()
  }, [slug])

  if (loading) {
    return (
      <div className='w-full flex items-center justify-center min-h-screen'>
        <p className="animate-pulse">Loading product details...</p>
      </div>
    )
  }

  return (
    <div className='w-full flex flex-col items-center justify-start min-h-screen p-4'>
      {product ? (
        <div className="w-full max-w-4xl">
           <h1 className="text-xl font-bold mb-4 uppercase">Update: {product.name}</h1>
           <UpdateProductForm product={product} />
        </div>
      ) : (
        <div className="text-center">
          <p className="text-red-500">No product found for slug: <strong>{slug}</strong></p>
        </div>
      )}
    </div>
  )
}

export default SlugProductPage