import { isInventoryManager } from '@/lib/middleware'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata={
    title:'New Purchase | Super Shop',
    description:'New Purchase add page in Super shop'
}

const NewPurchaseLayout =async ({children}) => {
  const auth=await isInventoryManager()
  if(!auth.success) return redirect('/panel')
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default NewPurchaseLayout
