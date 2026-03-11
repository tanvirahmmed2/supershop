'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FiSearch, FiUser, FiPhone, FiStar, FiShoppingBag, FiLoader } from 'react-icons/fi'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchCustomers = async (value = '') => {
    setLoading(true)
    try {
      const res = await axios.get(`/api/customer?value=${value}`)
      if (res.data.success) {
        setCustomers(res.data.payload)
      }
    } catch (error) {
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers(searchTerm)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  return (
    <div className='w-full p-6 bg-[#fcfcfc] min-h-screen flex flex-col gap-6'>
      
      
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-black text-slate-800 tracking-tight uppercase'>Customer Base</h1>
          <p className='text-sm text-slate-500 font-medium'>Manage loyalty and track shopping frequency</p>
        </div>
        
        <div className='relative w-full md:w-96'>
          <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className='w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium shadow-sm'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-4'>
          <div className='p-4 bg-blue-50 text-blue-600 rounded-2xl'><FiUser size={24}/></div>
          <div>
            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Total Registered</p>
            <p className='text-2xl font-black text-slate-900'>{customers.length}</p>
          </div>
        </div>
        <div className='bg-white p-6 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-4'>
          <div className='p-4 bg-orange-50 text-orange-600 rounded-2xl'><FiStar size={24}/></div>
          <div>
            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Avg. Loyalty Points</p>
            <p className='text-2xl font-black text-slate-900'>
              {customers.length > 0 ? Math.round(customers.reduce((a, b) => a + (b.points || 0), 0) / customers.length) : 0}
            </p>
          </div>
        </div>
      </div>

      

      <div className='bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]'>
                <th className='p-6'>Customer Info</th>
                <th className='p-6'>Contact</th>
                <th className='p-6 text-center'>Total Orders</th>
                <th className='p-6 text-center'>Loyalty Points</th>
                <th className='p-6 text-right'>Joined Date</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-50'>
              {loading ? (
                <tr>
                  <td colSpan="5" className='p-20 text-center'>
                    <div className='flex flex-col items-center gap-3'>
                      <FiLoader className='animate-spin text-blue-600' size={30} />
                      <span className='text-xs font-black text-slate-400 uppercase tracking-widest'>Searching Ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((c) => (
                  <tr key={c.customer_id} className='hover:bg-slate-50/50 transition-all group'>
                    <td className='p-6'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-500 uppercase text-xs'>
                          {c.name?.slice(0, 2)}
                        </div>
                        <div>
                          <p className='text-sm font-black text-slate-800'>{c.name}</p>
                          <p className='text-[10px] text-slate-400 font-bold uppercase'>ID: {c.customer_id.toString().slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className='p-6 text-sm font-bold text-slate-600'>
                      <div className='flex items-center gap-2'>
                        <FiPhone size={14} className='text-slate-300' />
                        {c.phone}
                      </div>
                    </td>
                    <td className='p-6 text-center'>
                      <div className='inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-black'>
                        <FiShoppingBag size={12} /> {c.total_orders}
                      </div>
                    </td>
                    <td className='p-6 text-center'>
                      <div className='flex items-center justify-center gap-1 text-orange-500 font-black'>
                        <FiStar size={14} fill="currentColor" />
                        <span>{c.points}</span>
                      </div>
                    </td>
                    <td className='p-6 text-right'>
                      <p className='text-sm font-bold text-slate-700'>{new Date(c.created_at).toLocaleDateString('en-GB')}</p>
                      <p className='text-[10px] text-slate-400 font-medium uppercase'>{new Date(c.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className='p-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs'>
                    No customers found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Customers