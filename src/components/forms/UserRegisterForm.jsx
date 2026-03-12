'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const UserRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/user', formData, { withCredentials: true })
      toast.success(res.data.message)
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: ''
      })
      window.location.replace('/user-login')
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create account")

    }
  }
  return (
    <form onSubmit={handleSubmit} className='w-full flex flex-col items-center gap-4'>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="name">Name</label>
        <input type="text" name='name' id='name' onChange={handleChange} required value={formData.name} className='w-full px-3 p-1 border border-black/20 outline-none'/>
      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="email">Email</label>
        <input type="email" name='email' id='email' onChange={handleChange} required value={formData.email} className='w-full px-3 p-1 border border-black/20 outline-none'/>
      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="phone">Phone</label>
        <input type="text" name='phone' id='phone' onChange={handleChange} required value={formData.phone} className='w-full px-3 p-1 border border-black/20 outline-none'/>
      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="password">Password</label>
        <input type="text" name='password' id='password' onChange={handleChange} required value={formData.password} className='w-full px-3 p-1 border border-black/20 outline-none'/>
      </div>
      <Link href={'/user-login'} className='w-full text-xs text-right'>Login</Link>
      <button className='w-full bg-black hover:bg-gray-800 text-white p-1 text-center cursor-pointer' type='submit'>Next</button>
    </form>
  )
}

export default UserRegisterForm
