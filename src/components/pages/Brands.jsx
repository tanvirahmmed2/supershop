import { BASE_URL } from '@/lib/database/secret'
import React from 'react'
import BrandCard from '../card/BrandCard'

const Brands = async() => {
    const res = await fetch(`${BASE_URL}/api/brand`, {
    method: 'GET',
    cache: 'no-store'
  })

  if (!res.ok) return <p>invalid request</p>
  const data = await res.json()
  if (!data.success) return <p>no brand found</p>
  const brands = data.payload
  
  return (
    <div className='w-full flex flex-col items-center gap-4'>
      <h1 className='w-full text-2xl font-semibold border-b-2 p-2 '>Brands</h1>
      <h1 className='w-full  font-semibold border-b-2 border-black/10 text-right'>({brands.length})</h1>
      {
        brands.length > 0 && <div className='w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8'>
          {
            brands.map((brand) => (
              <BrandCard key={brand.brand_id} brand={brand} />
            ))
          }
        </div>
      }

    </div>
  )
}

export default Brands
