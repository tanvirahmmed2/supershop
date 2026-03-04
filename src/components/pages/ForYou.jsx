import { BASE_URL } from '@/lib/database/secret'
import React from 'react'
import Item from '../card/Item'
import Link from 'next/link'

const ForYou = async () => {
  const res = await fetch(`${BASE_URL}/api/product/discount`, {
    method: 'GET',
    cache: 'no-store'
  })
  if (!res.ok) return console.log('Invalid search')
  const data = await res.json()
  if (!data.success) return console.log(data.message)
  const products = data.payload
  return (
    <div className='w-full flex flex-col items-center gap-4'>
      <p className='w-full text-2xl font-semibold border-b-2 p-2 text-right text-orange-500'>Just For you</p>
      {
        products.length > 0 && <div className='w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4'>
          {
            products.map((product) => (
              <Item key={product.product_id} product={product} />
            ))
          }
        </div>
      }
<Link className='px-4 p-1 bg-orange-400 text-white rounded-lg hover:bg-orange-300' href={'/products'}>Load more</Link>
    </div>
  )
}

export default ForYou
