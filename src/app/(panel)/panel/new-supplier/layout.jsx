import { isManager } from '@/lib/middleware'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata={
    title:'New Supplier | Super Shop',
    description:'New Supplier add page in Super shop'
}

const NewSupplierLayout = async({children}) => {
   const auth= await isManager()
    if(!auth.success) return redirect('/panel')
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default NewSupplierLayout
