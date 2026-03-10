'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../helper/Context'

const PurchaseForm = () => {
  const { suppliers, fetchSuppliers, purchase, clearPurchase, removeFromPurchase, decreasePurchaseQuantity, staff,  setSupplierBox } = useContext(Context)
  useEffect(() => { fetchSuppliers() }, [])
  const [formData, setFormData] = useState({
    supplier_id: '',
    branch_id: staff?.staff_id,
    items: purchase?.items || [],
    total_amoutn: '',
    shipping_const: '',
    discount: '',
    grand_total: '',
    payment_method: '',
    transaction_id: ''
  })
  return (
    <form className='w-full flex flex-col items-center gap-3'>
      <div className='w-full flex flex-col gap-1 border-b-2 border-black/20 py-4'>
        <div className='w-full flex flex-row items-center justify-between'>
          <label htmlFor="supplier_id">Supplier</label>
          <button type='button' className='px-3 p-1 rounded-2xl cursor-pointer bg-black text-white' onClick={()=>setSupplierBox(true)}>+</button>
        </div>
        <select name="supplier_id" id="supplier_id" className='w-full py-1 border border-black/20 outline-none'>
          <option value="">Select</option>
          {
            suppliers?.length > 0 && suppliers.map((supplier) => (
              <option value={supplier.supplier_id} key={supplier.supplier_id}>{supplier.name}</option>
            ))
          }
        </select>
      </div>

    </form>
  )
}

export default PurchaseForm
