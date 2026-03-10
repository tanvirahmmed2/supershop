'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link';

import { TbMenu2, TbMenu3 } from "react-icons/tb";
import { toast } from 'react-toastify';
import axios from 'axios';

const PanelNavbar = () => {
  const { panelSidebar, setPanelSidebar, staff } = useContext(Context)

  const [currentTime, setCurrentTime] = useState('')
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toString().split(" GMT")[0]
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout=async()=>{
    try {
      const res= await axios.get('/api/staff/logout', {withCredentials:true})
      toast.success(res.data.message)
      window.location.replace('/staff-login')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to logout')
      
    }
  }


  return (
    <div className='w-full h-14 fixed z-50 top-0 left-0 border-b-2 border-black/10 bg-white flex items-center justify-between px-4'>
      <div className='w-auto flex flex-row items-center justify-center gap-10'>
        <button className='text-2xl font-semibold cursor-pointer' onClick={() => setPanelSidebar(!panelSidebar)}>{panelSidebar ? <TbMenu3 /> : <TbMenu2 />}</button>
        <Link className='text-xl font-semibold' href={'/panel'}>Panel</Link>
      </div>
      <div className='w-auto flex flex-row items-center justify-center gap-4'>
        <p>Welcome, {staff?.name}</p>
        <button onClick={handleLogout} className='h-14 px-3 bg-gray-200 cursor-pointer'>Logout</button>
        <p>{currentTime}</p>
      </div>
    </div>
  )
}

export default PanelNavbar
