import { isManager } from '@/lib/middleware'
import { redirect } from 'next/dist/server/api-utils'
import React from 'react'

export const metadata={
    title:'New Branch | Super Shop',
    description:'New Branch add page in Super shop'
}

const NewBranchLayout =async ({children}) => {
   const auth= await isManager()
    if(!auth.success) return redirect('/panel')
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default NewBranchLayout
