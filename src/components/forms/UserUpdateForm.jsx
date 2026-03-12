'use client'
import React, { useContext, useState, useEffect } from 'react'
import { Context } from '../helper/Context'
import { toast } from 'react-toastify'
import axios from 'axios'

const UserUpdateForm = () => {
    const { user } = useContext(Context)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: ''
    })

    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, name: user.name || '', email: user.email || '' }))
        }
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        
        if (formData.password && formData.password !== formData.confirm_password) {
            return toast.error("Passwords do not match!")
        }

        try {
            const res = await axios.patch('/api/user', formData, { withCredentials: true })
            toast.success(res.data.message)
            window.location.replace('/profile')
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update user')        
        }
    }

    const isPasswordMismatch = formData.password !== formData.confirm_password;

    return (
        <form onSubmit={handleUpdate} className='w-full max-w-md flex flex-col gap-4 bg-white p-6 shadow-sm border border-black/10'>
            <h1 className='text-xl font-bold border-b pb-2'>Account Settings</h1>
            
            <div className='flex flex-col gap-1'>
                <label className='text-xs font-semibold uppercase text-gray-500'>Full Name</label>
                <input type="text" name='name' required onChange={handleChange} value={formData.name} className='w-full px-3 py-2 border border-black/20 outline-none focus:border-black'/>
            </div>

            <div className='flex flex-col gap-1'>
                <label className='text-xs font-semibold uppercase text-gray-500'>Email Address</label>
                <input type="email" name='email' required onChange={handleChange} value={formData.email} className='w-full px-3 py-2 border border-black/20 outline-none focus:border-black'/>
            </div>

            <hr className='my-2 border-dashed' />
            <p className='text-[10px] text-blue-600 italic'>Leave password fields empty if you don't want to change it.</p>

            <div className='flex flex-col gap-1'>
                <label className='text-xs font-semibold uppercase text-gray-500'>New Password</label>
                <input type="password" name='password' onChange={handleChange} value={formData.password} className='w-full px-3 py-2 border border-black/20 outline-none focus:border-black'/>
            </div>

            <div className='flex flex-col gap-1'>
                <label className='text-xs font-semibold uppercase text-gray-500'>Confirm New Password</label>
                <input type="password" name='confirm_password' onChange={handleChange} value={formData.confirm_password} className={`w-full px-3 py-2 border outline-none focus:border-black ${isPasswordMismatch && formData.confirm_password ? 'border-red-500' : 'border-black/20'}`}/>
            </div>

            <button 
                disabled={isPasswordMismatch}
                className={`w-full py-2 mt-2 text-white font-bold transition-all ${isPasswordMismatch ? 'bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`} 
                type='submit'
            >
                Update Profile
            </button>
        </form>
    )
}

export default UserUpdateForm