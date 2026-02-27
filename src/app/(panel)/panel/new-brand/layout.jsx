import React from 'react'

export const metadata={
    title:'New Brand | Super Shop',
    description:'New Brand add page in Super shop'
}

const NewBrandLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default NewBrandLayout
