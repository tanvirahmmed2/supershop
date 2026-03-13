import { isManager } from '@/lib/middleware'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata={
    title:'Customers | Super Shop',
    description:'Customers add page in Super shop'
}

const CustomersLayout =async ({children}) => {
   const auth= await isManager()
    if(!auth.success) return redirect('/panel')
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default CustomersLayout
