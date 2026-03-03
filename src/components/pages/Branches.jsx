import { BASE_URL } from '@/lib/database/secret'
import React from 'react'
import BranchCard from '../card/BranchCard'

const Branches = async() => {
    const res = await fetch(`${BASE_URL}/api/branch`, {
    method: 'GET',
    cache: 'no-store'
  })

  if (!res.ok) return <p>invalid request</p>
  const data = await res.json()
  if (!data.success) return <p>no branch  found</p>
  const branches = data.payload
  
  return (
    <div className='w-full flex flex-col items-center gap-4'>
      <h1 className='w-full text-2xl font-semibold border-b-2 p-2 '>Branches</h1>
      <h1 className='w-full  font-semibold border-b-2 border-black/10 text-right'>({branches.length})</h1>
      {
        branches.length > 0 && <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
          {
            branches.map((branch) => (
              <BranchCard key={branch.branch_id} branch={branch} />
            ))
          }
        </div>
      }

    </div>
  )
}

export default Branches
