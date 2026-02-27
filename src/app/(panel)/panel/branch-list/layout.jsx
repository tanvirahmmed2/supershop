import React from 'react'

export const metadata={
    title:'Branch List | Super Shop',
    description:'Branch List add page in Super shop'
}

const BranchListLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default BranchListLayout
