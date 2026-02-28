'use client'
import AddBrandForm from '@/components/forms/AddBrandForm'
import AddCategoryForm from '@/components/forms/AddCategoryForm'
import AddProductForm from '@/components/forms/AddProductForm'
import { Context } from '@/components/helper/Context'
import React, { useContext } from 'react'
import { MdCancel } from 'react-icons/md'

const NewProductPage = () => {
  const { categoryBox, setCategoryBox, brandBox, setBrandBox } = useContext(Context)
  console.log(categoryBox)
  return (
    <div className='w-full flex flex-col items-center gap-6 relative'>
      <h1 className='w-full text-center text-2xl font-semibold'>Add New Product</h1>
      <AddProductForm />

      {
        categoryBox === true && <div className=' fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 '>
          <div className='w-auto bg-white p-4 rounded-2xl relative flex flex-col items-center justify-center '>
            <button className='text-2xl absolute top-2 right-2 cursor-pointer' onClick={() => setCategoryBox(false)}><MdCancel /></button>
            <h1>Add Category</h1>
            <AddCategoryForm />
          </div>
        </div>
      }
      
      {
       brandBox === true && <div className=' fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 '>
          <div className='w-auto bg-white p-4 rounded-2xl relative flex flex-col items-center justify-center '>
            <button className='text-2xl absolute top-2 right-2 cursor-pointer' onClick={() => setBrandBox(false)}><MdCancel /></button>
            <h1>Add Brand</h1>
            <AddBrandForm />
          </div>
        </div>
      }

    </div>
  )
}

export default NewProductPage
