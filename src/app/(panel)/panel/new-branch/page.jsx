
import AddBranchForm from '@/components/forms/AddBranchForm'
import React from 'react'

const NewBranchPage = () => {
  return (
    <div className='w-full flex flex-col items-center gap-6'>
        <h1 className='w-full text-center text-2xl font-semibold'>Open New Branch</h1>
        <AddBranchForm/>
      
    </div>
  )
}

export default NewBranchPage
