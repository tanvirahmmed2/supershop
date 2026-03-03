'use client'
import React, { useContext, useState } from 'react'
import { Context } from '../helper/Context'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddStaffForm = () => {
  const { branches } = useContext(Context)

  const roles = ['manager', 'branch-manager', 'sales', 'inventory-manager']
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
        password:''
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
        <input type="text" name='name' id='name' required onChange={handleChange} value={formData.name}/>
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" name='email' id='email' onChange={handleChange} required value={formData.email} />
      </div>
      <div>
        <div>
          <label htmlFor="branch_id">Branch</label>
          <select id='branch_id' name='branch_id' value={formData.branch_id} onChange={handleChange} required >
            <option value="">Select</option>
            {
              branches.length>0 && branches.map((branch)=>(
                <option value={branch.branch_id} key={branch.branch_id} >{branch.name}</option>
              ))
            }
          </select>
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select name="role" id="role" required value={formData.role} onChange={handleChange}>
            <option value="">Select</option>
            {
              roles.length>0 && roles.map((role)=>(
                <option value={role} key={role}>{role}</option>
              ))
            }
          </select>
        </div>
      </div>
      <div>
        <label htmlFor=""></label>
      </div>
    </form>
  )
}

export default AddStaffForm
