
import AddSupplierForm from '@/components/forms/AddSupplierForm'
import React from 'react'

const NewSupplier = () => {
  return (
   <div className='w-full flex flex-col items-center gap-6'>
        <h1 className='w-full text-center text-2xl font-semibold'>New Supplier</h1>
        <AddSupplierForm/>
      
    </div>
  )
}

export default NewSupplier
