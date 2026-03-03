'use client'
import React, { useContext, useState } from 'react'
import { Context } from '../helper/Context'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddStaffForm = () => {
  const { branches } = useContext(Context)

  const reles = ['manager', 'branch-manager', 'sales', 'stock-manager']
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    branch_id: '',
    role: '',
    phone: '',

  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const res = await axios.post('/api/staff', formData, { withCredentials: true })
      toast.success(res.data.message)
      setFormData({
        name: '',
        email: '',
        branch_id: '',
        role: '',
        phone: '',

      })
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Failed to add staff')

    }
  }
  return (
    <form onSubmit={handleSubmit} className='w-full max-w-3xl flex flex-col items-center gap-4'>
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" name='name' id='name' required onChange={handleChange} />
      </div>
    </form>
  )
}

export default AddStaffForm
