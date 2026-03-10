import { isStaff } from '@/lib/middleware'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata={
    title:'Staff Login | Super Shop',
    description:'Staff Login Page of Super Shop'
}

const StaffLoginLayout = async({children}) => {
  const auth= await isStaff()
  if(auth.success) return redirect('/profile')
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default StaffLoginLayout
