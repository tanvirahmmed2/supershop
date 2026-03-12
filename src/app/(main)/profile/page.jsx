'use client'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import Link from 'next/link'
import React, { useContext } from 'react'
import { TbUserEdit } from 'react-icons/tb'
import { toast } from 'react-toastify'

const UserProfilePage = () => {
  const {user}= useContext(Context)

  const handleLogout=async()=>{
    try {
      const res= await axios.get('/api/user/logout',{withCredentials:true})
      toast.success(res.data.message)
      window.location.replace('/user-login')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to logout')
      
    }
  }
  return (
    <div className='w-full flex flex-col items-center justify-center min-h-screen gap-3'>
      <h1 className='font-mono'>Welcome to </h1>
      <h1 className='text-4xl font-semibold font-mono md:text-8xl'>Super Shop</h1>
      <div className='w-auto flex flex-col items-center gap-1 border border-black/10 shadow p-8 font-mono rounded-2xl relative'>
        <Link href={'/profile/update'} className='text-2xl opacity-40 absolute top-2 right-2 cursor-pointer bg-gray-200 rounded-2xl p-1'><TbUserEdit/></Link>
        <h1 className='font-semibold'>{user?.name}</h1>
        <p>{user?.email}</p>
        <p>{user?.phone}</p>
        <button className='px-3 rounded-2xl shadow-md border border-black/10 cursor-pointer hover:shadow-xl' onClick={handleLogout}>Logout</button>
      </div>
      <Link href={'/profile/purchases'} className='px-3 rounded-2xl shadow-md border border-black/10 cursor-pointer hover:shadow-xl'>Purchases</Link>
    </div>
  )
}

export default UserProfilePage
