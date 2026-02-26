import React from 'react'

export const metadata={
    title:'Login | Super Shop',
    description:'Login Page of Super Shop'
}

const LoginLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default LoginLayout
