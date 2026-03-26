'use client'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'


const Intro = () => {
  const [products, setProducts] = useState([])
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/sales/topsales', { withCredentials: true })
        setProducts(res.data.payload)
      } catch (error) {
        setProducts([])
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (products.length === 0) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [products])

  if (!products || products.length === 0) return

  return (
    <div className=' w-full relative aspect-video overflow-hidden flex items-center justify-center'>
      <div className='w-full aspect-video  overflow-hidden opacity-70'>
        <Image src={products[index].image} alt='product image' width={1000} height={1000} className='w-full aspect-video object-cover overflow-hidden' />
      </div>
      <div className='w-full aspect-video absolute top-0 backdrop-blur-xs bg-black/40 flex flex-col items-center justify-center gap-2 text-white'>
        <p className='font-black uppercase'>TOP sales</p>
        <h1 className='text-center text-base md:text-2xl font-semibold'>{products[index].name.slice(0,100)}...</h1>
        <p className='text-xs md:text-base'>{products[index].description.slice(0, 50)}...</p>
        <p>BDT {products[index].sale_price - products[index].discount_price}</p>
        <Link href={`/products/${products[index].slug}`} className='px-6 bg-orange-400 text-white rounded-2xl p-1' >View</Link>
        <div className='flex justify-center gap-3 mt-8'>
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 transition-all duration-300 rounded-full ${i === index ? 'w-8 bg-black' : 'w-2 bg-slate-300'
                }`}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Intro
