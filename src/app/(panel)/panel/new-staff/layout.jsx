import React from 'react'

export const metadata={
    title:'New Staff | Super Shop',
    description:'New Staff add page in Super shop'
}

const NewStaffLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default NewStaffLayout
