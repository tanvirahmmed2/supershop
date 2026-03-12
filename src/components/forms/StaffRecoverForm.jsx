'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const StaffRecoverForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        new_password: '',
        confirm_password: ''
    })
    const [otpSent, setOtpSent] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const sendEmail = async () => {
        try {
            const res = await axios.patch('/api/staff/recover', { data: formData.email }, { withCredentials: true })
            toast.success(res.data.message)
            setOtpSent(true)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send OTP")
            setOtpSent(false)
        }
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        try {
            const res= await axios.patch('/api/staff/recover/password', formData, {withCredentials:true})
            toast.success(res.data.message)
            window.location.replace('/staff-login')
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to change password')
            
        }
    }
    return (
        <form className='w-full flex flex-col items-center gap-4' onSubmit={handleSubmit}>
            {
                !otpSent ? <div className='w-full flex flex-col items-center gap-3'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="email">Email</label>
                        <input type="email" name='email' id='email' onChange={handleChange} required value={formData.email} className='w-full px-3 p-1 border border-black/20 outline-none'/>
                    </div>
                    <button type='button' onClick={sendEmail} className='w-full bg-black text-white p-1 hover:bg-gray-800 cursor-pointer rounded-2xl'>Next</button>
                </div> : <div className='w-full flex flex-col items-center gap-4'>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="new_password">New Password</label>
                        <input type="text" id='new_password' name='new_password' required onChange={handleChange} value={formData.new_password} className='w-full px-3 p-1 border border-black/20 outline-none'/>
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <label htmlFor="confirm_password">Confirm Password</label>
                        <input type="text" id='confirm_password' name='confirm_password' onChange={handleChange} value={formData.confirm_password} required className='w-full px-3 p-1 border border-black/20 outline-none'/>
                    </div>
                    <Link href={'/staff-login'} className='w-full text-right'>Login</Link>
                    {formData.new_password===formData.confirm_password && formData.confirm_password.length>0 && <button type='submit' className='w-full bg-black text-white p-1 hover:bg-gray-800 cursor-pointer rounded-2xl'>Next</button>}
                </div>
            }
        </form>
    )
}

export default StaffRecoverForm
