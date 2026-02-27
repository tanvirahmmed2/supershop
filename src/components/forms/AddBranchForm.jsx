'use client'
import React, { useContext, useState } from 'react'
import { Context } from '../helper/Context'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddBranchForm = () => {
  const { fetchBranches } = useContext(Context)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    map_url: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const confirm=window.confirm('All information is correct?')
    if(!confirm) return
    try {
      const res = await axios.post('/api/branch', formData, { withCredentials: true })
      toast.success(res.data.message)
      if(fetchBranches){
        fetchBranches()
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Failed to creat branch')
    }
  }
  return (
    <form onSubmit={handleSubmit} className='w-full flex flex-col items-center gap-4 max-w-3xl'>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="name">Name</label>
        <input type="text" name='name' id='name' required onChange={handleChange} value={formData.name}  className='w-full px-3 p-1 border border-black/10 outline-none'/>
      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="location">Location</label>
        <input type="text" name="location" id="location" required onChange={handleChange} value={formData.location} className='w-full px-3 p-1 border border-black/10 outline-none' placeholder='Enter branch location like "Dhaka, Rangpur"' />
      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="mapu_url">Map link</label>
        <input type="text" name='map_url' id='map_url' required onChange={handleChange} value={formData.map_url} className='w-full px-3 p-1 border border-black/10 outline-none' placeholder='enter map url' />
      </div>
      <button type='submit' className='w-full p-1 text-center bg-black text-white hover:bg-gray-700 cursor-pointer'>Submit</button>

    </form>
  )
}

export default AddBranchForm
