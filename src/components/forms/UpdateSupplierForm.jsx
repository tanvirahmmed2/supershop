'use client'
import axios from 'axios'
import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { Context } from '../helper/Context'

const UpdateSupplierForm = ({ supplier }) => {
  const { fetchSuppliers } = useContext(Context)

  // Initialize state with existing supplier data
  const [formData, setFormData] = useState({
    supplier_id: supplier?.supplier_id || '',
    name: supplier?.name || '',
    phone: supplier?.phone || '',
    email: supplier?.email || '',
    address: supplier?.address || '',
    company_tin: supplier?.company_tin || ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.patch('/api/supplier', formData, { withCredentials: true })
      
      if (res.data.success) {
        toast.success(res.data.message)
        if (fetchSuppliers) {
          fetchSuppliers()
        }
        // Force refresh or handle state update to close modal
        window.location.reload()
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update supplier data')
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-3xl flex flex-col gap-3 items-center'>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="name">Name</label>
        <input type="text" name='name' id='name' required onChange={handleChange} value={formData.name} className='w-full px-3 p-1 border border-black/10 outline-none' />
      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="phone">Phone</label>
        <input type="text" id='phone' name='phone' required onChange={handleChange} value={formData.phone} className='w-full px-3 p-1 border border-black/10 outline-none' />
      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="email">Email</label>
        <input type="email" name='email' id='email' required onChange={handleChange} value={formData.email} className='w-full px-3 p-1 border border-black/10 outline-none' />
      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="address">Address</label>
        <input type="text" id='address' name='address' onChange={handleChange} value={formData.address} className='w-full px-3 p-1 border border-black/10 outline-none' />
      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="company_tin">Company Tin</label>
        <input type="text" id='company_tin' name='company_tin' onChange={handleChange} value={formData.company_tin} className='w-full px-3 p-1 border border-black/10 outline-none' />
      </div>
      <button type='submit' className='w-full p-2 bg-black text-white hover:bg-gray-700 cursor-pointer text-center font-bold'>
        Update Supplier
      </button>
    </form>
  )
}

export default UpdateSupplierForm