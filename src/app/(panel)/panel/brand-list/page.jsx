'use client'
import BrandCard from '@/components/card/BrandCard'
import { Context } from '@/components/helper/Context'
import Image from 'next/image'
import React, { useContext } from 'react'

const BrandListPage = () => {
  const { brands } = useContext(Context)


  return (
    <div className='w-full flex flex-col items-center gap-4'>
      <h1 className='w-full text-2xl font-semibold border-b-2 p-2 '>Brands</h1>
      <h1 className='w-full  font-semibold border-b-2 border-black/10 text-right'>({brands.length})</h1>
      {
        brands.length > 0 ? <div className='w-full flex flex-col items-center gap-1'>
          {
            brands.map((brand) => (
              <div key={brand.brand_id} className='w-full grid grid-cols-3 even:bg-gray-300'>
                <Image src={brand.logo} alt='brand logo' width={50} height={50} />
                <p>{brand.name}</p>
                <button>Action</button>
              </div>
            ))
          }
        </div> : <p>No data found</p>
      }

    </div>
  )
}

export default BrandListPage
