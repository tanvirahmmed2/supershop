import AddCategoryForm from '@/components/forms/AddCategoryForm'
import React from 'react'

const NewCategory = () => {
  return (
   <div className='w-full flex flex-col items-center gap-6'>
        <h1 className='w-full text-center text-2xl font-semibold'>New Category</h1>
        <AddCategoryForm/>
      
    </div>
  )
}

export default NewCategory
