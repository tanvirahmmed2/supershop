'use client'
import { Context } from '@/components/helper/Context'
import React, { useContext, useEffect } from 'react'

const SupplierListPage = () => {
  const { suppliers, fetchSuppliers } = useContext(Context)

  useEffect(() => {
    if (fetchSuppliers) {
      fetchSuppliers()
    }
  }, [])

  
  
  return (
    <div className='w-full flex flex-col items-center gap-4'>
      <h1 className='w-full text-2xl font-semibold border-b-2 p-2 '>Suppliers</h1>
      <h1 className='w-full  font-semibold border-b-2 border-black/10 text-right'>({suppliers.length})</h1>
      {
        suppliers.length > 0 ? <div className='w-full flex flex-col items-center gap-1'>
          {
            suppliers.map((Supplier) => (
              <div key={Supplier.Supplier_id} className='w-full grid grid-cols-3 even:bg-gray-300'>
                <p>{Supplier.name}</p>
                <button>Action</button>
              </div>
            ))
          }
        </div> : <p>No data found</p>
      }

    </div>
  )
}

export default SupplierListPage
