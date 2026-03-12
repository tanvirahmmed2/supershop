'use client'
import { Context } from '@/components/helper/Context'
import SameCategoryProduct from '@/components/pages/SameCategoryProduct'
import axios from 'axios'
import Image from 'next/image'
import React, { use, useContext, useEffect, useState } from 'react'

const SlugProductPage = ({ params }) => {
  const { slug } = use(params)
  const {addToCart}= useContext(Context)

  const [product, setProduct] = useState(null)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/product/${slug}`, { withCredentials: true })
        setProduct(res.data.payload)
      } catch (error) {
        setProduct(null)
      }
    }
    fetchProduct()
  }, [slug])

  return (
    <div className='w-full flex flex-col items-center justify-center min-h-screen'>
      {
        product === null ? <p>
          No data found

        </p> : <div className='w-full flex flex-col items-center gap-8'>
          <div className='w-full flex flex-col md:flex-row  gap-4 max-w-6xl'>
            <div className='w-full overflow-hidden p-2 rounded-2xl shadow border border-black/20'>
              <Image src={product?.image} alt='prduct image' width={1000} height={1000} className='object-cover aspect-auto rounded-2xl' />
            </div>
            <div className='w-full flex flex-col gap-2 '>
              <p className='font-semibold text-base md:text-2xl'>{product?.name}</p>
              <p className='font-mono'>{product?.category_name}</p>
              <div className='w-auto flex flex-row items-center gap-4'>
                <p className=' font-semibold line-through text-red-400'>৳{product?.discount_price > 0 && product?.sale_price.split('.')[0]}</p>
                <p className='text-2xl font-semibold'>৳{product?.sale_price - product?.discount_price}</p>
              </div>
              <button className='bg-orange-400 text-white rounded-sm cursor-pointer hover:opacity-75' onClick={()=>addToCart(product)}>Add to Cart</button>
              <p className='text-sm opacity-60'>{product?.description}</p>
              {product?.features.length > 0 && <div>
                <p>Features:</p>
                {
                  product?.features.map((f) => (
                    <p key={f}>* {f}</p>
                  ))
                }
              </div>}
            </div>
          </div>
          <h1>More of {product?.category_name} products</h1>
          <SameCategoryProduct slug={product?.category_slug} />
        </div>
      }

    </div>
  )
}

export default SlugProductPage
