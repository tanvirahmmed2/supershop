'use client'
import UpdateSupplierForm from '@/components/forms/UpdateSupplierForm'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import {  MdCancel, MdDeleteOutline, MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'

const SupplierListPage = () => {
  const { suppliers, fetchSuppliers } = useContext(Context)

  useEffect(() => {
    if (fetchSuppliers) {
      fetchSuppliers()
    }
  }, [])

   const [editBox, setEditBox]= useState(null)


  const handleDelete=async(id)=>{
    const confirm= window.confirm('Are you sure to delete the brand?')
    if(!confirm) return 
    try {
      const res= await axios.delete('/api/supplier', {data:{id}, withCredentials:true})
      toast.success(res.data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete brand")
      
    }
  }

  
  return (
    <div className='w-full flex flex-col items-center gap-4 text-xs sm:text-base'>
      <h1 className='w-full text-2xl font-semibold border-b-2 p-2 '>Suppliers</h1>
      <h1 className='w-full  font-semibold border-b-2 border-black/10 text-right'>({suppliers.length})</h1>
      {
        suppliers.length > 0 ? <div className='w-full flex flex-col items-center gap-1'>
          {
            suppliers.map((supplier) => (
              <div key={supplier.supplier_id} className='w-full grid grid-cols-3 even:bg-gray-300'>
                <p >{supplier.name}</p>
                <p >{supplier.email}</p>
                <div className='w-full flex flex-row items-center justify-center gap-4 text-xl'>
                  <button className='cursor-pointer' onClick={()=>handleDelete(supplier.supplier_id)}><MdDeleteOutline/></button>
                  <button className='cursor-pointer' onClick={()=>setEditBox(supplier)}><MdEdit/></button>
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
            <UpdateSupplierForm supplier={editBox}/>
          </div>
        </div>
      }
    </div>
  )
}

export default SupplierListPage
