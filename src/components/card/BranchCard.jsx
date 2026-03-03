'use client'
import React from 'react'
import { motion } from 'framer-motion';
import { CiLocationOn } from "react-icons/ci";
import Link from 'next/link';

const BranchCard = ({branch}) => {
  return (
     <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.7 }} className='w-full border cursor-pointer border-black/10 hover:shadow-lg shadow group transition ease-in-out duration-500'>
            <Link href={branch.map_url}  className='w-full flex items-center gap-4 flex-col p-2 '>
                <CiLocationOn className='text-6xl text-orange-400'/>
                <h1 className='w-full text-center'>{branch.name}</h1>
            </Link>

        </motion.div>
  )
}

export default BranchCard
