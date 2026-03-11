import ContactForm from '@/components/forms/ContactForm'
import React from 'react'

const Contact = () => {
    return (
        <div className='w-full flex flex-col items-center justify-center gap-4 md:flex-row min-h-screen'>
            <div className='w-full flex flex-col gap-1'>
                <p className='text-xl font-semibold border-b py-1 w-full text-left'>Get in touch</p>
                <h1 className='text-4xl font-semibold font-mono md:text-6xl'>Super Shop</h1>

            </div>
            <ContactForm />

        </div>
    )
}

export default Contact
