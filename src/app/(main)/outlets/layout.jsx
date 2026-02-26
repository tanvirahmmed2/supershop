import React from 'react'

export const metadata={
    title:'Outlets | Super Shop',
    description:'Outlets Page of Super Shop'
}

const OutletsLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default OutletsLayout
