'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../helper/Context'
import { RiMenuFold3Fill, RiMenuFold4Fill } from "react-icons/ri";
import Link from 'next/link';

const PanelNavbar = () => {
  const { panelSidebar, setPanelSidebar } = useContext(Context)

  const [currentTime, setCurrentTime] = useState('')
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toString().split(" GMT")[0]
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className='w-full h-14 fixed z-50 top-0 left-0 border-b-2 border-black/10 bg-white flex items-center justify-between px-4'>
      <div className='w-auto flex flex-row items-center justify-center gap-4'>
        <button className='text-2xl font-semibold cursor-pointer' onClick={() => setPanelSidebar(!panelSidebar)}>{panelSidebar ? <RiMenuFold3Fill /> : <RiMenuFold4Fill />}</button>
        <Link className='text-xl font-semibold' href={'/panel'}>Panel</Link>
      </div>
      <div>

        <p>{currentTime}</p>
      </div>
    </div>
  )
}

export default PanelNavbar
