'use client'
import UpdateCategoryForm from '@/components/forms/UpdateCategoryForm'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import { MdCancel, MdDeleteOutline, MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'

const CategoryListPage = () => {
  const { categories } = useContext(Context)
  const [editBox, setEditBox]= useState(null)

  const handleDelete=async(id)=>{
    const confirm= window.confirm('Are you sure to delete this category?')
    if(!confirm) return
    try {
      const res= await axios.delete('/api/category', {data:{id}, withCredentials:true})
      toast.success(res.data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed tp delete category')
    }
  }


  return (
    <div className='w-full flex flex-col items-center gap-4 text-xs sm:text-base relative'>
      <h1 className='w-full text-2xl font-semibold border-b-2 p-2 '>Categories</h1>
      <h1 className='w-full  font-semibold border-b-2 border-black/10 text-right'>({categories.length})</h1>
      {
        categories.length > 0 ? <div className='w-full flex flex-col items-center gap-1'>
          {
            categories.map((cat) => (
              <div key={cat.category_id} className='w-full grid grid-cols-6 even:bg-gray-300'>
                <Image src={cat.image} alt='category image' width={50} height={50}  className='col-span-1'/>
                <p className='col-span-4'>{cat.name}</p>
                <div className='col-span-1 w-full flex flex-row items-center justify-center gap-4'>
                  <button className='text-xl cursor-pointer' onClick={()=>handleDelete(cat.category_id)}><MdDeleteOutline/></button>
                  <button className='text-xl cursor-pointer' onClick={()=>setEditBox(cat)}><MdEdit/></button>

                </div>
              </div>
            ))
          }
        </div> : <p>No data found</p>
      }
      {
        editBox!==null && <div className='fixed flex items-center justify-center z-40 backdrop-blur-2 bg-black/40 inset-0'>
          <div className='w-auto bg-white p-4 rounded-2xl relative'>
            <button className='top-2 right-2 absolute cursor-pointer text-2xl' onClick={()=>setEditBox(null)}><MdCancel/></button>
            <UpdateCategoryForm category={editBox}/>
          </div>
        </div>
      }

    </div>
  )
}

export default CategoryListPage
