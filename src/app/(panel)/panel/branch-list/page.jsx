'use client'
import CategoryCard from '@/components/card/CategoryCard'
import { Context } from '@/components/helper/Context'
import Image from 'next/image'
import React, { useContext } from 'react'

const CategoryListPage = () => {
  const { branches } = useContext(Context)


  return (
    <div className='w-full flex flex-col items-center gap-4'>
      <h1 className='w-full text-2xl font-semibold border-b-2 p-2 '>Branches</h1>
      <h1 className='w-full  font-semibold border-b-2 border-black/10 text-right'>({branches.length})</h1>
      {
        branches.length > 0 ? <div className='w-full flex flex-col items-center gap-1'>
          <div className='w-full grid grid-cols-4 py-4'>
            <p>Name</p>
            <p>Location</p>
            <p>Contact</p>
            <button>Action</button>
          </div>
          {
            branches.map((branch) => (
              <div key={branch.branch_id} className='w-full grid grid-cols-4 p-2 even:bg-gray-300'>
                <p>{branch.name}</p>
                <p>{branch.location}</p>
                <p>{branch.phone}</p>
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
