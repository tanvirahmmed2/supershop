'use client'
import axios from 'axios'
import React, { useState } from 'react'

const CategoryListPage = () => {
  const [staffs, setStaffs]=useState([])
  const fetchStaff=async()=>{
    try {
      const res= await axios.get('/api/staff', {withCredentials:true})
    } catch (error) {
      console.log(error)
      
    }
  }
  return (
    <div className='w-full flex flex-col items-center gap-4'>
      <h1 className='w-full text-2xl font-semibold border-b-2 p-2 '>Branches</h1>
      <h1 className='w-full  font-semibold border-b-2 border-black/10 text-right'>({staffs.length})</h1>
      {
        staffs.length > 0 ? <div className='w-full flex flex-col items-center gap-1'>
          <div className='w-full grid grid-cols-4 py-4'>
            <p>Name</p>
            <p>Location</p>
            <p>Contact</p>
            <button>Action</button>
          </div>
          {
            branches.map((branch) => (
              <div key={branch.branch_id} className='w-full grid grid-cols-4 p-2 even:bg-gray-300'>
                <p>{branch.name}</p>
                <p>{branch.location}</p>
                <p>{branch.phone}</p>
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
