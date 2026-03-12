
import { isUserLogin } from '@/lib/usermiddleware'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata={
    title:'Checkout | Super Shop',
    description:'Checkout Page of Super Shop'
}

const CheckoutLayout = async({children}) => {
  const auth= await isUserLogin()
  if(!auth.success) return redirect('/user-login')
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default CheckoutLayout
