
import AddStaffForm from '@/components/forms/AddStaffForm'
import React from 'react'

const NewBranchPage = () => {
  return (
    <div className='w-full flex flex-col items-center gap-6'>
        <h1 className='w-full text-center text-2xl font-semibold'>Appoint New Staff</h1>
        <AddStaffForm/>
      
    </div>
  )
}

export default NewBranchPage
