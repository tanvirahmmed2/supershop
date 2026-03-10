'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const CategoryListPage = () => {
  const [staffs, setStaffs]=useState([])
  const fetchStaff=async()=>{
    try {
      const res= await axios.get('/api/staff', {withCredentials:true})
      setStaffs(res.data.payload)
    } catch (error) {
      console.log(error)
      
    }
  }

  useEffect(()=>{fetchStaff()},[])
  return (
    <div className='w-full flex flex-col items-center gap-4'>
      <h1 className='w-full text-2xl font-semibold border-b-2 p-2 '>Staffs</h1>
      <h1 className='w-full  font-semibold border-b-2 border-black/10 text-right'>({staffs.length})</h1>
      {
        staffs.length > 0 ? <div className='w-full flex flex-col items-center gap-1'>
          <div className='w-full grid grid-cols-5 py-4'>
            <p>Name</p>
            <p>Role</p>
            <p>Branch Name</p>
            <p>Email</p>
            <button>Action</button>
          </div>
          {
            staffs.map((staff) => (
              <div key={staff.staff_id} className='w-full grid grid-cols-5 p-2 even:bg-gray-300'>
                <p>{staff.name}</p>
                <p>{staff.role}</p>
                <p>{staff.branch_name || 'Main'}</p>
                <p>{staff.email}</p>
                <button>Action</button>
              </div>
            ))
          }
        </div> : <p>No data found</p>
      }

    </div>
  )
}

export default CategoryListPage
