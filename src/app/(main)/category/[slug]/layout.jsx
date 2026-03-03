import React from 'react'

export const metadata={
    title:'Category products',
    description:'Category products page'
}

const CategoryProductLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default CategoryProductLayout
