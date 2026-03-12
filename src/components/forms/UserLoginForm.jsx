'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const UserLoginForm = () => {
  const [formData, setFormData]= useState({
    email:'',
    password:''
  })

  const handleChange=(e)=>{
    const {name, value}= e.target
    setFormData((prev)=>({...prev,[name]:value}))
  }

  const handleLogin=async(e)=>{
    e.preventDefault()
    try {
      const res= await axios.post('/api/user/login', formData, {withCredentials:true})
      toast.success(res.data.message)
      window.location.replace('/profile')
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Failed to log in')
      
    }
  }
  return (
    <form onSubmit={handleLogin} className='w-full flex flex-col gap-4'>
      <div className='flex flex-col gap-1 w-full'>
        <label htmlFor="email">Email</label>
        <input type="email" name='email' id='email' onChange={handleChange} value={formData.email} required  className='w-full px-3 p-1 border border-black/20 outline-none'/>
      </div>
      <div className='flex flex-col gap-1 w-full'>
        <label htmlFor="password">Password</label>
        <input type="password" id='password' name='password' value={formData.password} required onChange={handleChange} className='w-full px-3 p-1 border border-black/20 outline-none' />
      </div>
      <div className='w-full flex flex-row items-center justify-between'>
        <Link className=' text-xs' href={'/user-register'}>Create account</Link>
      <Link className=' text-xs' href={'/user-recover'}>Recover account</Link>
      </div>
      <button type='submit' className='px-4 p-1 bg-black text-white hover:bg-black/80 cursor-pointer'>Login</button>
    </form>
  )
}

export default UserLoginForm
