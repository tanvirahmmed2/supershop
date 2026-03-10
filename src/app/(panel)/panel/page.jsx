'use client'
import { Context } from '@/components/helper/Context'
import React, { useContext } from 'react'
import { motion } from 'framer-motion'

const PanelHomePage = () => {
  const { staff } = useContext(Context)
  return (
    <div className='w-full min-h-screen flex items-center justify-center'>
      <div className='w-auto mx-auto flex flex-col items-center justify-center text-center'>
        <h1 className='text-lg font-semibold font-mono'>Welcome</h1>
        <h1 className='text-xl md:text-3xl font-semibold font-mono'>{staff?.name} </h1>
        <span className='text-xs uppercase'>{staff?.role}</span>
        <motion.h1 initial={{opacity:0}} whileInView={{opacity:1}} transition={{duration:0.9}} className='text-4xl sm:text-8xl font-semibold font-sans my-6'>Super Shop</motion.h1>
        <p className='text-lg font-semibold font-mono opacity-40'> {staff?.branch_name || 'Head Office'}</p>
        <p className='text-lg font-semibold font-mono'>Have a good day in {staff?.branch_location || 'Head Office'}!</p>

      </div>


    </div>
  )
}

export default PanelHomePage
