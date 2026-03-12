import Cart from '@/components/pages/Cart'
import React from 'react'

const CartPage = () => {
  
  return (
    <div className='w-full flex flex-col items-center gap-4'>
      <h1 className='w-full text-center border-b py-4'>My Cart</h1>
      <Cart/>
      
    </div>
  )
}

export default CartPage
