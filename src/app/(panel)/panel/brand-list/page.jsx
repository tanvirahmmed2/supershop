'use client'
import UpdateBrandForm from '@/components/forms/UpdateBrandForm'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import { MdCancel, MdDeleteOutline, MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'

const BrandListPage = () => {
  const { brands } = useContext(Context)
  const [editBox, setEditBox]= useState(null)


  const handleDelete=async(id)=>{
    const confirm= window.confirm('Are you sure to delete the brand?')
    if(!confirm) return 
    try {
      const res= await axios.delete('/api/brand', {data:{id}, withCredentials:true})
      toast.success(res.data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete brand")
      
    }
  }

  


  return (
    <div className='w-full flex flex-col items-center gap-4 text-xs sm:text-base relative'>
      <h1 className='w-full text-2xl font-semibold border-b-2 p-2 '>Brands</h1>
      <h1 className='w-full  font-semibold border-b-2 border-black/10 text-right'>({brands.length})</h1>
      {
        brands.length > 0 ? <div className='w-full flex flex-col items-center gap-1'>
          {
            brands.map((brand) => (
              <div key={brand.brand_id} className='w-full grid grid-cols-6 even:bg-gray-300'>
                <Image src={brand.logo} alt='brand logo' width={50} height={50}  className='col-span-1'/>
                <p className='col-span-4'>{brand.name}</p>
                <div className='col-span-1 flex flex-row items-center justify-center gap-4'>
                  <button className='text-2xl cursor-pointer' onClick={()=>handleDelete(brand.brand_id)}><MdDeleteOutline/></button>
                  <button className='text-2xl cursor-pointer' onClick={()=>setEditBox(brand)}><MdEdit/></button>
                  
                </div>
              </div>
            ))
          }
        </div> : <p>No data found</p>
      }
      {
        editBox!==null && <div className='flex items-center justify-center z-40 inset-0 fixed backdrop-blur-[6px] bg-black/30'>
          <div className='w-auto bg-white p-4 relative'>
            <button className=' text-2xl cursor-pointer absolute top-2 right-2' onClick={()=>setEditBox(null)}><MdCancel/></button>
            <UpdateBrandForm brand={editBox}/>
          </div>
        </div>
      }

    </div>
  )
}

export default BrandListPage
