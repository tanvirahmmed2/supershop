'use client'
import React from 'react'
import { CiMail } from 'react-icons/ci'
import { MdCardTravel, MdHelpCenter, MdHighQuality, MdLocalOffer, MdSupportAgent } from 'react-icons/md'

const Service = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center gap-4 text-xs'>
      <div className='w-full grid grid-cols-2 md:grid-cols-4 gap-4 '>
        <div className='w-full flex flex-col md:flex-row items-center justify-center gap-4 shadow-lg rounded-xl hover:shadow-xl py-4 p-4 bg-gray-200'>
          <MdCardTravel className='text-5xl'/>
          <div className='flex flex-col gap-1'>
            <p className='text-2xl font-semibold'>Fast Delivery</p>
            <p className=' font-semibold'>Free for all type order</p>
          </div>
        </div>
        
        <div className='w-full flex flex-col md:flex-row items-center justify-center gap-4 shadow-lg rounded-xl hover:shadow-xl py-4 p-4 bg-gray-200'>
          <MdHighQuality className='text-5xl'/>
          <div className='flex flex-col gap-1'>
            <p className='text-2xl font-semibold'>Best Quality</p>
            <p className=' font-semibold'>We believe in quality</p>
          </div>
        </div>
        
        <div className='w-full flex flex-col md:flex-row items-center justify-center gap-4 shadow-lg rounded-xl hover:shadow-xl py-4 p-4 bg-gray-200'>
          <MdLocalOffer className='text-5xl'/>
          <div className='flex flex-col gap-1'>
            <p className='text-2xl font-semibold'>Exchange Offer</p>
            <p className=' font-semibold'>Exchange products in lest than 1 day</p>
          </div>
        </div>
        
        <div className='w-full flex flex-col md:flex-row items-center justify-center gap-4 shadow-lg rounded-xl hover:shadow-xl py-4 p-4 bg-gray-200'>
          <MdHelpCenter className='text-5xl'/>
          <div className='flex flex-col gap-1'>
            <p className='text-2xl font-semibold '>Help Center</p>
            <p className=' font-semibold '>24/7 support system</p>
          </div>
        </div>

      </div>
      <div className='w-full flex flex-col md:flex-row items-center justify-center gap-4'>
      <button className='w-full shadow-lg rounded-xl hover:shadow-xl py-4 p-2 cursor-pointer flex items-center justify-center gap-3 bg-gray-200'>Call <MdSupportAgent/></button>
      <button className='w-full shadow-lg rounded-xl hover:shadow-xl py-4 p-2 cursor-pointer flex items-center justify-center gap-3 bg-gray-200'>Mail <CiMail/></button>
      </div>
    </div>
  )
}

export default Service
