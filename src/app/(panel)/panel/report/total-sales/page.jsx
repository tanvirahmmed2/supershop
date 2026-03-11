'use client'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { FiFilter, FiTrendingUp, FiShoppingBag, FiAward, FiBarChart2 } from 'react-icons/fi'

const TotalSalesReport = () => {
    const { branches } = useContext(Context)
    const [salesData, setSalesData] = useState([])
    const [loading, setLoading] = useState(false)
    const [branch_term, setBranch_Term] = useState('')

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true)
            try {
              
                const res = await axios.get(`/api/sales?branch_id=${branch_term}`)
                if (res.data.success) {
                    setSalesData(res.data.payload)
                }
            } catch (error) {
                setSalesData([])
            } finally {
                setLoading(false)
            }
        }
        fetchReport()
    }, [branch_term])

    
    const totalRevenue = salesData?.reduce((acc, curr) => acc + Number(curr.grand_total), 0) || 0;
    const totalDiscountGiven = salesData?.reduce((acc, curr) => acc + Number(curr.discount_amount), 0) || 0;
    const totalTransactions = salesData?.length || 0;

    return (
        <div className='w-full p-6  min-h-screen flex flex-col gap-6'>
            
            {/* Page Title & Branch Switcher */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-4xl border border-slate-100 shadow-sm'>
                <div>
                    <h1 className='text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2'>
                        <FiBarChart2 className='text-blue-600'/> SALES PERFORMANCE
                    </h1>
                    <p className='text-sm text-slate-500 font-medium'>Monitor revenue streams and customer transactions</p>
                </div>
                
                <div className='flex items-center gap-3 bg-slate-50 p-2 px-5 rounded-2xl border border-slate-100'>
                    <FiFilter className='text-slate-400' />
                    <select 
                        onChange={(e) => setBranch_Term(e.target.value)} 
                        value={branch_term}
                        className='bg-transparent outline-none text-xs font-black text-slate-800 uppercase tracking-widest cursor-pointer'
                    >
                        <option value="">All Shop Branches</option>
                        {branches?.map((b) => (
                            <option value={b.branch_id} key={b.branch_id}>{b.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white p-8 rounded-8 border border-slate-100 shadow-sm flex items-center gap-5'>
                    <div className='p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-inner'><FiTrendingUp size={28}/></div>
                    <div>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>Gross Revenue</p>
                        <p className='text-3xl font-black text-slate-900 leading-none mt-1'>৳{totalRevenue.toLocaleString()}</p>
                    </div>
                </div>

                <div className='bg-white p-8 rounded-8 border border-slate-100 shadow-sm flex items-center gap-5'>
                    <div className='p-4 bg-green-50 text-green-600 rounded-2xl shadow-inner'><FiShoppingBag size={28}/></div>
                    <div>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>POS Volume</p>
                        <p className='text-3xl font-black text-slate-900 leading-none mt-1'>{totalTransactions}</p>
                    </div>
                </div>

                <div className='bg-white p-8 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-5'>
                    <div className='p-4 bg-purple-50 text-purple-600 rounded-2xl shadow-inner'><FiAward size={28}/></div>
                    <div>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>Promo Applied</p>
                        <p className='text-3xl font-black text-slate-900 leading-none mt-1'>৳{totalDiscountGiven.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            

            {/* Sales Ledger */}
            <div className='bg-white rounded-8 shadow-sm border border-slate-100 overflow-hidden'>
                <div className='p-6 border-b border-slate-50 flex justify-between items-center'>
                    <h2 className='text-xs font-black text-slate-400 uppercase tracking-widest'>Recent Transaction Log</h2>
                    <span className='text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-black uppercase'>Live Feed</span>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left'>
                        <thead>
                            <tr className='bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-widest'>
                                <th className='p-6'>Transaction Date</th>
                                <th className='p-6'>Invoice</th>
                                <th className='p-6'>Customer</th>
                                <th className='p-6'>Branch</th>
                                <th className='p-6 text-right'>Net Total</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-50'>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className='p-20 text-center'>
                                        <div className='flex flex-col items-center gap-3'>
                                            <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                                            <p className='text-xs font-black text-slate-400 uppercase tracking-widest'>Calculating report...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : salesData.length > 0 ? (
                                salesData.map((s) => (
                                    <tr key={s.sale_id} className='hover:bg-slate-50/50 transition-all text-sm font-medium group'>
                                        <td className='p-6 text-slate-500'>
                                            {new Date(s.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className='p-6'>
                                            <span className='font-mono font-black text-blue-600 uppercase text-xs bg-blue-50 px-3 py-1 rounded-lg'>
                                                #{s.invoice_no}
                                            </span>
                                        </td>
                                        <td className='p-6'>
                                            <div className='flex flex-col'>
                                                <span className='text-slate-800 font-bold'>{s.customer_name || 'Walk-in'}</span>
                                                <span className='text-[10px] text-slate-400 font-bold uppercase'>{s.customer_phone || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className='p-6'>
                                            <span className='text-[10px] border border-slate-200 px-3 py-1 rounded-full font-black text-slate-500 uppercase tracking-tighter'>
                                                {s.branch_name}
                                            </span>
                                        </td>
                                        <td className='p-6 text-right font-black text-slate-900 text-lg'>
                                            ৳{Number(s.grand_total).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className='p-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs'>
                                        No sales records found for this criteria
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

export default TotalSalesReport