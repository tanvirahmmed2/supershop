'use client'
import Link from 'next/link'
import React from 'react'
import { RiHome4Line } from "react-icons/ri";
import { IoBagAddOutline, IoListSharp } from "react-icons/io5";
import { MdOutlineLocalOffer } from "react-icons/md";

const Bottombar = () => {
    return (
        <div className='w-full fixed bottom-0 left-0 h-14 bg-white border-t-2 border-black/10 flex sm:hidden flex-row items-center justify-around'>
            <Link className='w-full flex flex-col items-center justify-center text-[10px] gap-1 hover:bg-gray-100' href={'/'}><RiHome4Line className='text-xl' /> Home</Link>
            <Link className='w-full flex flex-col items-center justify-center text-[10px] gap-1 hover:bg-gray-100' href={'/category'}><IoListSharp className='text-xl' /> Category</Link>
            <Link className='w-full flex flex-col items-center justify-center text-[10px] gap-1 hover:bg-gray-100' href={'/products'}><MdOutlineLocalOffer className='text-xl' /> Products</Link>
            <Link className='w-full flex flex-col items-center justify-center text-[10px] gap-1 hover:bg-gray-100' href={'/cart'}><IoBagAddOutline className='text-xl' /> Cart</Link>
        </div>
    )
}

export default Bottombar
