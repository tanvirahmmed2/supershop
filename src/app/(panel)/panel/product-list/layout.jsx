import React from 'react'

export const metadata={
    title:'Product List | Super Shop',
    description:'Product List add page in Super shop'
}

const ProductListLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default ProductListLayout
