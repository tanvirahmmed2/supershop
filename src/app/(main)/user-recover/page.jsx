
import UserRecoverForm from '@/components/forms/UserRecoverForm'
import React from 'react'

const StaffRecoverPage = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center min-h-screen'>
      <div className='auto mx-auto flex flex-col items-center justify-center gap-4 shadow-xl border text-sm border-black/20 sm:text-base bg-white p-5 rounded-2xl'>
        <div className='flex flex-col items-center'>
          <p>Welscome to</p>
          <h1 className='text-xl sm:text-2xl font-black'>Super Shop</h1>
          <p>Recover your account</p>

        </div>
        <UserRecoverForm/>
      </div>
    </div>
  )
}

export default StaffRecoverPage
