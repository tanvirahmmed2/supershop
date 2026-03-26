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
    }, 7000)
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
        <h1 className='text-center text-2xl font-semibold'>{products[index].name}</h1>
        <p>{products[index].description.slice(0, 50)}...</p>
        <p>BDT {products[index].sale_price - products[index].discount_price}</p>
        <Link href={`/products/${products[index].slug}`} className='px-6 bg-orange-400 text-white rounded-2xl p-1' >View</Link>
      </div>

    </div>
  )
}

export default Intro
