import React from 'react'

export const metadata={
    title:'Brand | Super Shop',
    description:'Brand Page of Super Shop'
}

const BrandLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default BrandLayout
