
import React from 'react'
import CategoryCard from '../card/CategoryCard'
import { BASE_URL } from '@/lib/database/secret'

const Categories = async () => {
  const res = await fetch(`${BASE_URL}/api/category`, {
    method: 'GET',
    cache: 'no-store'
  })

  if (!res.ok) return <p>invalid request</p>
  const data = await res.json()
  if (!data.success) return <p>no category found</p>
  const categories = data.payload
  
  return (
    <div className='w-full flex flex-col items-center gap-4'>
      <h1 className='w-full text-2xl font-semibold border-b-2 p-2 '>Categories</h1>
      <h1 className='w-full  font-semibold border-b-2 border-black/10 text-right'>({categories.length})</h1>
      {
        categories.length > 0 && <div className='w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8'>
          {
            categories.map((cat) => (
              <CategoryCard key={cat.category_id} category={cat} />
            ))
          }
        </div>
      }

    </div>
  )
}

export default Categories
