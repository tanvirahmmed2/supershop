
import { isUserLogin } from '@/lib/usermiddleware'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata={
    title:'User Login | Super Shop',
    description:'User Login Page of Super Shop'
}

const UserLoginLayout = async({children}) => {
  const auth= await isUserLogin()
  if(auth.success) return redirect('/panel')
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default UserLoginLayout
