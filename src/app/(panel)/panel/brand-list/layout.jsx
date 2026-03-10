import { isManager } from '@/lib/middleware'
import { redirect } from 'next/dist/server/api-utils'
import React from 'react'

export const metadata={
    title:'Brand List | Super Shop',
    description:'Brand List add page in Super shop'
}

const BrandListLayout = async({children}) => {
   const auth= await isManager()
    if(!auth.success) return redirect('/panel')
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default BrandListLayout
