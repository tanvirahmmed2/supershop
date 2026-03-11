'use client'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { FiDollarSign, FiEye, FiTrendingUp, FiCreditCard } from 'react-icons/fi'
import Link from 'next/link'

const SalesPaymentListPage = () => {
  const { staff } = useContext(Context)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get('/api/sales/payment/branch', { withCredentials: true })
        if (res.data.success) setPayments(res.data.payload)
      } catch (error) {
        setPayments([])
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [staff?.branch_id])

  const totalReceived = payments.reduce((acc, curr) => acc + Number(curr.amount_paid), 0)

  return (
    <div className='w-full p-6 bg-[#fcfcfc] min-h-screen'>
      <div className='max-w-6xl mx-auto flex flex-col gap-6'>
        
        <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-4'>
          <div>
            <h1 className='text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-2'>
              <FiCreditCard className='text-blue-600'/> Revenue Ledger
            </h1>
            <p className='text-sm text-slate-500 font-medium'>Detailed log of all customer payments and POS inflows</p>
          </div>
          
          <div className='bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 min-w-60'>
            <div className='p-3 bg-blue-50 text-blue-600 rounded-xl shadow-inner'>
                <FiTrendingUp size={24}/>
            </div>
            <div>
              <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Total Collected</p>
              <p className='text-2xl font-black text-slate-900 leading-none mt-1'>
                ৳{totalReceived.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-8 shadow-sm border border-slate-100 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead>
                <tr className='bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]'>
                  <th className='p-5'>Payment Date</th>
                  <th className='p-5'>Invoice No</th>
                  <th className='p-5'>Customer Details</th>
                  <th className='p-5 text-center'>Method</th>
                  <th className='p-5 text-right'>Amount Received</th>
                  <th className='p-5 text-center'>View</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-50'>
                {loading ? (
                  <tr>
                    <td colSpan="6" className='p-20 text-center'>
                        <div className='flex flex-col items-center gap-2 animate-pulse'>
                            <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                            <span className='text-xs font-black text-slate-400 uppercase tracking-widest'>Fetching Ledger...</span>
                        </div>
                    </td>
                  </tr>
                ) : payments.length > 0 ? (
                  payments.map((p) => (
                    <tr key={p.payment_id} className='hover:bg-slate-50/50 transition-all group'>
                      <td className='p-5'>
                        <div className='flex flex-col'>
                            <span className='text-sm font-bold text-slate-700'>
                                {new Date(p.payment_date).toLocaleDateString('en-GB')}
                            </span>
                            <span className='text-[10px] text-slate-400 font-bold uppercase'>
                                {new Date(p.payment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                      </td>
                      <td className='p-5'>
                        <span className='font-mono font-black text-blue-600 uppercase text-xs bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100'>
                          {p.invoice_no}
                        </span>
                      </td>
                      <td className='p-5'>
                        <div className='flex flex-col'>
                            <span className='text-sm font-black text-slate-800'>{p.customer_name || 'Walk-in Customer'}</span>
                            <span className='text-[11px] text-slate-500 font-medium tracking-tight'>{p.customer_phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td className='p-5 text-center'>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            p.payment_method === 'cash' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-purple-50 text-purple-700 border-purple-100'
                        }`}>
                            {p.payment_method}
                        </span>
                      </td>
                      <td className='p-5 text-right'>
                        <span className='text-lg font-black text-slate-900 tracking-tight'>
                            ৳{Number(p.amount_paid).toLocaleString()}
                        </span>
                      </td>
                      <td className='p-5 text-center'>
                        <Link 
                          href={`/dashboard/sales/${p.invoice_no}`} 
                          className='inline-flex items-center justify-center w-10 h-10 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm group-hover:shadow-md'
                          title="View Digital Receipt"
                        >
                          <FiEye size={20} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className='p-20 text-center text-slate-300 font-black uppercase tracking-[0.3em] text-xs'>
                        No transaction data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className='flex justify-between items-center px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
            <p>Branch: {staff?.branch_name || 'Primary'}</p>
            <p>{payments.length} Transactions Found</p>
        </div>
      </div>
    </div>
  )
}

export default SalesPaymentListPage