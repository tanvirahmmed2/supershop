'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const ContactForm = () => {
    const [formData, setFormData]= useState({
        name:'',
        email:'',
        subject:'',
        note:''
    })
    const handleChange=(e)=>{
        const {name, value}= e.target
        setFormData((prev)=>({...prev,[name]:value}))
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        try {
            const res= await axios.post('/api/support', formData, {withCredentials:true})
            toast.success(res.data.message)
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to send message')
            
        }
    }
  return (
    <form className='w-full flex flex-col items-center justify-center gap-3' onSubmit={handleSubmit}>
        <div className='w-full flex flex-col gap-1'>
            <label htmlFor="name">Name</label>
            <input type="text" name='name' id='name' required onChange={handleChange} value={formData.name} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
        <div className='w-full flex flex-col gap-1'>
            <label htmlFor="email">Email</label>
            <input type="email" name='email' id='email' required onChange={handleChange} value={formData.email} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
        <div className='w-full flex flex-col gap-1'>
            <label htmlFor="subject">Subject</label>
            <input type="text" name='subject' id='subject' required onChange={handleChange} value={formData.subject} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
        <div className='w-full flex flex-col gap-1'>
            <label htmlFor="note">Note</label>
            <textarea type="text" name='note' id='note' required onChange={handleChange} value={formData.note} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
        <button className='w-full p-1 bg-black text-white cursor-pointer' type='submit'>Submit</button>
    </form>
  )
}

export default ContactForm
