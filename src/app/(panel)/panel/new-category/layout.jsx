import { isManager } from '@/lib/middleware'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata={
    title:'New Category | Super Shop',
    description:'New Category add page in Super shop'
}

const NewCategoryLayout = async({children}) => {
   const auth= await isManager()
    if(!auth.success) return redirect('/panel')
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default NewCategoryLayout
