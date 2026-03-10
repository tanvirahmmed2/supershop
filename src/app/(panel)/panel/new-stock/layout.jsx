import React from 'react'

export const metadata={
    title:'New Category | Super Shop',
    description:'New Category add page in Super shop'
}

const NewCategoryLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default NewCategoryLayout
