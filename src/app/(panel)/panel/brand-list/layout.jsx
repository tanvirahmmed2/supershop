import React from 'react'

export const metadata={
    title:'Brand List | Super Shop',
    description:'Brand List add page in Super shop'
}

const BrandListLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default BrandListLayout
