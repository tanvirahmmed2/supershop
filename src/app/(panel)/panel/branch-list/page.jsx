'use client'
import UpdateBranchForm from '@/components/forms/UpdateBranchForm'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { MdCancel, MdDeleteOutline, MdModeEditOutline } from 'react-icons/md'
import { toast } from 'react-toastify'

const CategoryListPage = () => {
  const { branches, fetchBranches } = useContext(Context)
  const [editBranch, setEditBranch] = useState(null)

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure to delete the branch? Action can not be undone')
    if (!confirm) return
    try {
      const res = await axios.delete(`/api/branch`, { data: { id }, withCredentials: true })
      toast.success(res.data.message)
      fetchBranches()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete branch")

    }

  }


  return (
    <div className='w-full flex flex-col items-center gap-4 text-xs sm:text-base relative'>
      <h1 className='w-full text-2xl font-semibold border-b-2 p-2 '>Branches</h1>
      <h1 className='w-full  font-semibold border-b-2 border-black/10 text-right'>({branches.length})</h1>
      {
        branches.length > 0 ? <div className='w-full flex flex-col items-center gap-1'>
          <div className='w-full grid grid-cols-7 py-4'>
            <p className='col-span-2'>Name</p>
            <p className='col-span-2'>Location</p>
            <p className='col-span-2'>Contact</p>
            <button className='col-span-1'>Action</button>
          </div>
          {
            branches.map((branch) => (
              <div key={branch.branch_id} className='w-full grid grid-cols-7 p-2 even:bg-gray-300'>
                <p className='col-span-2'>{branch.name}</p>
                <p className='col-span-2'>{branch.location}</p>
                <p className='col-span-2'>{branch.phone}</p>
                <div className='col-span-1 flex flex-row items-center gap-4 '>
                  <button className='text-xl cursor-pointer' onClick={() => handleDelete(branch.branch_id)}><MdDeleteOutline /></button>
                  <button className='text-xl cursor-pointer' onClick={()=>setEditBranch(branch)}><MdModeEditOutline /></button>
                </div>
              </div>
            ))
          }
        </div> : <p>No data found</p>
      }
      {
        editBranch !== null && <div className='fixed z-40 inset-0 items-center justify-center flex bg-black/20 backdrop-blur-2'>
          <div className='w-auto bg-white p-2  rounded-lg relative'>
            <button className='text-xl cursor-pointer absolute top-2 right-2' onClick={()=>setEditBranch(null)}><MdCancel/></button>
            <UpdateBranchForm branch={editBranch}/>
          </div>
        </div> 
      }
    </div>
  )
}

export default CategoryListPage
