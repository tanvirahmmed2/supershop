'use client'
import CategoryCard from '@/components/card/CategoryCard'
import { Context } from '@/components/helper/Context'
import Image from 'next/image'
import React, { useContext } from 'react'

const CategoryListPage = () => {
  const { categories } = useContext(Context)


  return (
    <div className='w-full flex flex-col items-center gap-4'>
      <h1 className='w-full text-2xl font-semibold border-b-2 p-2 '>Categories</h1>
      <h1 className='w-full  font-semibold border-b-2 border-black/10 text-right'>({categories.length})</h1>
      {
        categories.length > 0 ? <div className='w-full flex flex-col items-center gap-1'>
          {
            categories.map((cat) => (
              <div key={cat.category_id} className='w-full grid grid-cols-3 even:bg-gray-300'>
                <Image src={cat.image} alt='category image' width={50} height={50} />
                <p>{cat.name}</p>
                <button>Action</button>
              </div>
            ))
          }
        </div> : <p>No data found</p>
      }

    </div>
  )
}

export default CategoryListPage
