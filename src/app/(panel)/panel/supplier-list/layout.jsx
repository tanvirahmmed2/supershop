import React from 'react'

export const metadata={
    title:'Supplier List | Super Shop',
    description:'Supplier List add page in Super shop'
}

const SupplierListLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden p-1 sm:p-4'>
      {children}
    </div>
  )
}

export default SupplierListLayout
