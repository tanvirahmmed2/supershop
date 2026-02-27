import React from 'react'

export const metadata={
    title:'Category List | Super Shop',
    description:'Category List add page in Super shop'
}

const CategoryListLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default CategoryListLayout
