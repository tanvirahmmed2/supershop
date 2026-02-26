import React from 'react'

export const metadata={
    title:'Products | Super Shop',
    description:'Products Page of Super Shop'
}

const ProductsLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default ProductsLayout
