'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { MdLogin } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { Context } from '../helper/Context';
import { UserRound } from 'lucide-react';


const Navbar = () => {
  const { user } = useContext(Context)
  return (
    <nav className='w-full fixed z-50 top-0 left-0 h-14 sm:h-16 md:h-20 bg-orange-100 flex flex-row items-center justify-around'>
      <Link className='text-lg sm:text-2xl font-semibold font-sans text-orange-500' href={'/'}>Super Shop</Link>
      <div className='w-auto flex flex-row items-center justify-center gap-1'>
        <button className='px-1 sm:px-4 text-sm sm:text-base md:text-lg cursor-pointer h-14 sm:h-16 md:h-20 w-auto flex items-center justify-center hover:bg-orange-200 ease-in-out transform duration-500'><IoSearchSharp /></button>
        <Link href={'/products'} className='px-1 sm:px-4 text-sm sm:text-base md:text-lg cursor-pointer h-14 sm:h-16 md:h-20 w-auto flex items-center justify-center hover:bg-orange-200 ease-in-out transform duration-500'>Products</Link>
        <Link href={'/outlets'} className='px-1 sm:px-4 text-sm sm:text-base md:text-lg cursor-pointer h-14 sm:h-16 md:h-20 w-auto flex items-center justify-center hover:bg-orange-200 ease-in-out transform duration-500'>Outlets</Link>
        {
          user === null ? <Link className='px-1 sm:px-4 text-sm sm:text-base md:text-lg cursor-pointer h-14 sm:h-16 md:h-20 w-auto flex items-center justify-center hover:bg-orange-200 ease-in-out transform duration-500' href={'/user-login'}><MdLogin /></Link> :
            <Link className='px-1 sm:px-4 text-sm sm:text-base md:text-lg cursor-pointer h-14 sm:h-16 md:h-20 w-auto flex items-center justify-center hover:bg-orange-200 ease-in-out transform duration-500' href={'/profile'}><UserRound /></Link>
        }

      </div>

    </nav>
  )
}

export default Navbar
