import React from 'react'

export const metadata={
    title:'New Product | Super Shop',
    description:'New Product add page in Super shop'
}

const NewProductLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default NewProductLayout
