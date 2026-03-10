
import { isUserLogin } from '@/lib/usermiddleware'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata={
    title:'Profile | Super Shop',
    description:'Profile Page of Super Shop'
}

const UserProfileLayout = async({children}) => {
  const auth= await isUserLogin()
  if(!auth.success) return redirect('/user-login')
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default UserProfileLayout
