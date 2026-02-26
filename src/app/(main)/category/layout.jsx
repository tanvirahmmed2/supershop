import React from 'react'

export const metadata={
    title:'Category | Super Shop',
    description:'Category Page of Super Shop'
}

const CategoryLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default CategoryLayout
