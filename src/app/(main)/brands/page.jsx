'use client'
import BrandCard from '@/components/card/BrandCard'
import { Context } from '@/components/helper/Context'
import React, { useContext } from 'react'

const BrandPage = () => {
  const { brands } = useContext(Context)

 
  return (
    <div className='w-full flex flex-col items-center gap-4'>
      <h1 className='w-full text-2xl font-semibold border-b-2 p-2 '>Brands</h1>
      <h1 className='w-full  font-semibold border-b-2 border-black/10 text-right'>({brands.length})</h1>
      {
        brands.length>0? <div className='w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8'>
          {
            brands.map((brand)=>(
              <BrandCard key={brand.brand_id} brand={brand}/>
            ))
          }
        </div>:<p>No data found</p>
      }

    </div>
  )
}

export default BrandPage
