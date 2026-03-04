'use client'
import Link from 'next/link'
import React from 'react'
import { CiFacebook, CiInstagram, CiMail } from 'react-icons/ci'

const Footer = () => {
  return (
    <div className='w-full flex flex-col items-center gap-4 bg-blue-900 text-white p-4 mt-4'>
      <div className='w-full grid grid-cols-2 md:grid-cols-4 justify-items-center gap-4'>
        <div className='w-full flex flex-col items-center justify-center gap-1'>
          <h1 className='text-2xl font-semibold'>Super Shop LTD</h1>
          <p className=''>We serve everything you need</p>
          <div className='w-full flex flex-row items-center justify-center gap-3 text-3xl'>
            <CiFacebook />
            <CiMail />
            <CiInstagram />
          </div>
        </div>
        <div className='w-full flex flex-col  gap-1'>
          <h1 className='text-lg font-semibold'>Contact Info</h1>
          <div className='flex flex-col gap-1'>
            <p>Call us:</p>
            <p>+8801805003886</p>
          </div>
          <div className='flex flex-col gap-1'>
            <p>Address:</p>
            <p>NotunBazar, Mymensingh</p>
          </div>

        </div>
        <div className='w-full flex flex-col gap-1'>
          <h1 className='text-lg font-semibold'>Quick Links</h1>
          <Link href={'/'}>About</Link>
          <Link href={'/'}>FAQ</Link>
          <Link href={'/'}>Support</Link>
          <Link href={'/'}>Privacy & Policy</Link>
        </div>
        <div className='w-full flex flex-col gap-1'>
          <h1 className='text-lg font-semibold'>User</h1>
          <Link href={'/account'}>My Account</Link>
          <Link href={'/register'}>Register</Link>
          <Link href={'/account/orders'}>Order</Link>
          <Link href={'/be-marchant'}>Be a Marchant</Link>
        </div>

      </div>

      <h1 className='w-full text-center font-sans'>All rights are reserved by  <Link href={'https://disibin.com'}>Disibin</Link></h1>
    </div>
  )
}

export default Footer
