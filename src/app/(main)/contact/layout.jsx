import React from 'react'

export const metadata={
    title:'Contact | Super Shop',
    description:'Contact page of super shop'
}

const ContactLayout = ({children}) => {
  return (
    <div className='w-full p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default ContactLayout
