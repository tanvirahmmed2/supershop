'use client'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import { Context } from '../helper/Context'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddCategoryForm = () => {
  const { fetchCategories } = useContext(Context)
  const [formData, setFormData] = useState({
    name: '',
    image: null
  })

  const [preview, setPreview] = useState('')

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      const file = files[0];

      if (!file) return;

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      const newPreview = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      setPreview(newPreview);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('image', formData.image)
      const res = await axios.post('/api/category', data, { withCredentials: true })
      toast.success(res.data.message)
      if (fetchCategories) {
        fetchCategories()
      }
      setFormData({
        name: '',
        image: null
      })

    } catch (error) {
      toast.error(error?.response?.data?.message || "failed to add category")
      console.log(error)

    }
  }

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-3xl flex flex-col items-center gap-2'>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="name">Name</label>
        <input type="text" name='name' id='name' required onChange={handleChange} value={formData.name} className='w-full px-3 p-1 border border-black/20 outline-none' />
      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="image">Image</label>
        <input type="file" name='image' id='image' required onChange={handleChange} accept='image/*' className='w-full px-3 p-1 border border-black/20 outline-none' />
      </div>
      {
        formData.image !== null && <Image src={preview} alt='logo' width={100} height={100} />
      }
      <button type='submit' className='w-full text-center bg-black p-1 cursor-pointer hover:bg-gray-700 text-white'>Submit</button>
    </form>
  )
}

export default AddCategoryForm
