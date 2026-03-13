'use client'
import Image from 'next/image'
import React, { useContext, useState, useEffect } from 'react'
import { Context } from '../helper/Context'
import { toast } from 'react-toastify'
import axios from 'axios'

const UpdateCategoryForm = ({ category }) => {
  const { fetchCategories } = useContext(Context)
  const [formData, setFormData] = useState({
    category_id: category?.category_id || '',
    name: category?.name || '',
    image: null
  })

  const [preview, setPreview] = useState(category?.image || '')

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      const file = files[0];
      if (!file) return;

      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }

      const newPreview = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(newPreview);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      data.append('category_id', formData.category_id)
      data.append('name', formData.name)
      // Only append if a new image is selected
      if (formData.image) {
        data.append('image', formData.image)
      }

      const res = await axios.patch('/api/category', data, { withCredentials: true })
      
      if (res.data.success) {
        toast.success(res.data.message)
        if (fetchCategories) fetchCategories()
        window.location.reload()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "failed to update category")
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
        <label htmlFor="image">Image (Leave blank to keep current)</label>
        <input type="file" name='image' id='image' onChange={handleChange} accept='image/*' className='w-full px-3 p-1 border border-black/20 outline-none' />
      </div>
      {preview && (
        <div className='mt-2'>
          <Image src={preview} alt='preview' width={100} height={100} className='object-cover h-24 w-24 border border-gray-200' />
        </div>
      )}
      <button type='submit' className='w-full text-center bg-black p-1 cursor-pointer hover:bg-gray-700 text-white'>Update Category</button>
    </form>
  )
}

export default UpdateCategoryForm