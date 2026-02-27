
import AddProductForm from '@/components/forms/AddProductForm'
import React from 'react'

const NewProductPage = () => {
  return (
    <div className='w-full flex flex-col items-center gap-6'>
        <h1 className='w-full text-center text-2xl font-semibold'>Add New Product</h1>
        <AddProductForm/>
      
    </div>
  )
}

export default NewProductPage
