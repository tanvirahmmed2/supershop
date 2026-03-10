import { isManager } from '@/lib/middleware'
import { redirect } from 'next/dist/server/api-utils'
import React from 'react'

export const metadata={
    title:'Category List | Super Shop',
    description:'Category List add page in Super shop'
}

const CategoryListLayout = async({children}) => {
   const auth= await isManager()
    if(!auth.success) return redirect('/panel')
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default CategoryListLayout
