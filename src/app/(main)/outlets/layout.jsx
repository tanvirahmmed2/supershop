import React from 'react'

export const metadata={
    title:'Outlets | Super Shop',
    description:'Outlets Page of Super Shop'
}

const OutletsLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden  h-screen'>
      {children}
    </div>
  )
}

export default OutletsLayout
