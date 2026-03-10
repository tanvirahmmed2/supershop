
import PurchaseForm from '@/components/forms/PurchaseForm'
import React from 'react'

const NewPurchase = () => {
  return (
   <div className='w-full flex flex-col items-center gap-6'>
        <h1 className='w-full text-center text-2xl font-semibold'>New Purchase</h1>
        <PurchaseForm/>
      
    </div>
  )
}

export default NewPurchase
