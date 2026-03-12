import React from 'react'

export const metadata={
    title:'Cart | Super Shop',
    description:'Cart Page of Super Shop'
}

const CartLayout = ({children}) => {
  return (
    <div className='w-full overflow-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default CartLayout
