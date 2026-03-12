'use client'
import ContactForm from '@/components/forms/ContactForm'
import React from 'react'
import { motion } from 'framer-motion'

const Contact = () => {
    return (
        <div className='w-full flex flex-col items-center justify-center gap-4  min-h-screen'>
            <p className='text-2xl font-mono font-semibold'>Find best products in your town</p>
            <div className='w-full flex flex-col md:flex-row items-center justify-center gap-4'>
                <div className='w-full flex flex-col gap-1'>
                <motion.p initial={{opacity:0, x:50}} whileInView={{opacity:1, x:0}} transition={{duration:1}} className='text-xl font-semibold py-1 w-full text-left'>Get in touch</motion.p>
                <h1 className='text-4xl font-semibold font-mono md:text-6xl'>Super Shop</h1>

            </div>
            <ContactForm />
            </div>

        </div>
    )
}

export default Contact
