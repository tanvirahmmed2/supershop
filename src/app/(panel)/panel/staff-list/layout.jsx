import React from 'react'

export const metadata={
    title:'Staff List | Super Shop',
    description:'Staff List add page in Super shop'
}

const StaffListLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default StaffListLayout
