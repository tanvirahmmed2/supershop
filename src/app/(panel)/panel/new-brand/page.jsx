import AddBrandForm from '@/components/forms/AddBrandForm'
import React from 'react'

const NewBrandPage = () => {
  return (
    <div className='w-full flex flex-col items-center gap-6'>
        <h1 className='w-full text-center text-2xl font-semibold'>New Brand</h1>
        <AddBrandForm/>
      
    </div>
  )
}

export default NewBrandPage
