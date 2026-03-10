'use client'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { FiSearch, FiDollarSign, FiCalendar, FiEye } from 'react-icons/fi'
import Link from 'next/link'

const PaymentListPage = () => {
  const { staff } = useContext(Context)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get('/api/purchase/payment/branch', { withCredentials: true })
        if (res.data.success) setPayments(res.data.payload)
      } catch (error) {
        setPayments([])
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [staff])

  const totalPaid = payments.reduce((acc, curr) => acc + Number(curr.amount_paid), 0)

  return (
    <div className='w-full p-6 bg-[#f8f9fa] min-h-screen'>
      <div className='max-w-6xl mx-auto flex flex-col gap-6'>
        
        <div className='flex justify-between items-end'>
          <div>
            <h1 className='text-2xl font-black text-slate-800 tracking-tight uppercase'>Payment History</h1>
            <p className='text-sm text-slate-500'>Tracking all supplier outflows and transactions</p>
          </div>
          <div className='bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4'>
            <div className='p-3 bg-green-100 text-green-600 rounded-full'><FiDollarSign size={20}/></div>
            <div>
              <p className='text-[10px] font-bold text-slate-400 uppercase'>Total Outflow</p>
              <p className='text-xl font-black text-slate-900'>৳{totalPaid.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead>
                <tr className='bg-slate-50 border-b text-[10px] font-black uppercase text-slate-500 tracking-widest'>
                  <th className='p-4'>Date</th>
                  <th className='p-4'>Invoice</th>
                  <th className='p-4'>Supplier</th>
                  <th className='p-4 text-center'>Method</th>
                  <th className='p-4 text-right'>Paid Amount</th>
                  <th className='p-4 text-center'>Action</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {loading ? (
                  <tr><td colSpan="6" className='p-20 text-center text-slate-400'>Loading transactions...</td></tr>
                ) : payments.length > 0 ? (
                  payments.map((p) => (
                    <tr key={p.payment_id} className='hover:bg-slate-50/50 transition-colors font-medium text-sm'>
                      <td className='p-4 text-slate-500'>
                        {new Date(p.payment_date).toLocaleDateString('en-GB')}
                      </td>
                      <td className='p-4 font-mono font-bold text-blue-600 uppercase text-xs'>
                        #{p.invoice_no}
                      </td>
                      <td className='p-4'>
                        <div className='flex flex-col'>
                            <span className='text-slate-800 font-semibold'>{p.supplier_name}</span>
                            <span className='text-[10px] text-slate-400 uppercase tracking-tighter'>{p.branch_name}</span>
                        </div>
                      </td>
                      <td className='p-4 text-center'>
                        <span className='px-2 py-0.5 bg-slate-100 border rounded text-[10px] font-bold text-slate-600 uppercase tracking-tight'>
                            {p.payment_method}
                        </span>
                      </td>
                      <td className='p-4 text-right font-black text-slate-900'>৳{Number(p.amount_paid).toLocaleString()}</td>
                      <td className='p-4 text-center'>
                        <Link 
                          href={`/panel/purchase/${p.invoice_no}`} 
                          className='inline-flex items-center justify-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all'
                          title="View Invoice Details"
                        >
                          <FiEye size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className='p-20 text-center text-slate-400 italic'>No payment records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentListPage