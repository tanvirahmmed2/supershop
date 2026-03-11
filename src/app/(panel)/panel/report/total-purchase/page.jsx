'use client'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { FiFilter, FiTrendingUp, FiShoppingBag, FiCreditCard } from 'react-icons/fi'

const TotalPurchaseReport = () => {
    const { branches } = useContext(Context)
    const [totalPurchases, setTotalPurchases] = useState([])
    const [loading, setLoading] = useState(false)
    const [branch_term, setBranch_Term] = useState('')

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`/api/purchase?branch_id=${branch_term}`)
                setTotalPurchases(res.data.payload)
            } catch (error) {
                setTotalPurchases([])
            } finally {
                setLoading(false)
            }
        }
        fetchReport()
    }, [branch_term])

    const totalAmount = totalPurchases?.reduce((acc, curr) => acc + Number(curr.grand_total), 0) || 0;
    const totalDiscount = totalPurchases?.reduce((acc, curr) => acc + Number(curr.discount), 0) || 0;
    const totalOrders = totalPurchases?.length || 0;

    return (
        <div className='w-full p-6  min-h-screen flex flex-col gap-6'>
            
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm'>
                <div>
                    <h1 className='text-2xl font-black text-slate-800 tracking-tight uppercase'>Purchase Summary Report</h1>
                    <p className='text-sm text-slate-500'>Analyze procurement costs across your super shop network</p>
                </div>
                
                <div className='flex items-center gap-3 bg-slate-50 p-2 px-4 rounded-xl border border-slate-200'>
                    <FiFilter className='text-slate-400' />
                    <label htmlFor="branch_id" className='text-xs font-bold text-slate-500 uppercase'>Branch:</label>
                    <select 
                        name="branch_id" 
                        id="branch_id" 
                        onChange={(e) => setBranch_Term(e.target.value)} 
                        value={branch_term}
                        className='bg-transparent outline-none text-sm font-bold text-slate-800 cursor-pointer'
                    >
                        <option value="">All Branches</option>
                        {branches?.map((b) => (
                            <option value={b.branch_id} key={b.branch_id}>{b.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4'>
                    <div className='p-4 bg-blue-100 text-blue-600 rounded-2xl'><FiTrendingUp size={24}/></div>
                    <div>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Net Expenditure</p>
                        <p className='text-2xl font-black text-slate-900'>৳{totalAmount.toLocaleString()}</p>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4'>
                    <div className='p-4 bg-green-100 text-green-600 rounded-2xl'><FiShoppingBag size={24}/></div>
                    <div>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Total Invoices</p>
                        <p className='text-2xl font-black text-slate-900'>{totalOrders}</p>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4'>
                    <div className='p-4 bg-red-100 text-red-600 rounded-2xl'><FiCreditCard size={24}/></div>
                    <div>
                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Savings (Discount)</p>
                        <p className='text-2xl font-black text-slate-900'>৳{totalDiscount.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            [Image of a data dashboard showing procurement expenditure and line graphs]


            <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
                <div className='p-5 border-b border-slate-100'>
                    <h2 className='text-sm font-black text-slate-700 uppercase'>Invoice Breakdown</h2>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left'>
                        <thead>
                            <tr className='bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-widest'>
                                <th className='p-4'>Date</th>
                                <th className='p-4'>Invoice ID</th>
                                <th className='p-4'>Supplier</th>
                                <th className='p-4'>Branch</th>
                                <th className='p-4 text-right'>Grand Total</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-100'>
                            {loading ? (
                                <tr><td colSpan="5" className='p-10 text-center text-slate-400 font-medium'>Processing report data...</td></tr>
                            ) : totalPurchases.length > 0 ? (
                                totalPurchases.map((p) => (
                                    <tr key={p.purchase_id} className='hover:bg-slate-50/50 transition-colors text-sm font-medium'>
                                        <td className='p-4 text-slate-500'>
                                            {new Date(p.created_at).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className='p-4'>
                                            <span className='font-mono font-bold text-blue-600 uppercase text-xs'>
                                                {p.invoice_no}
                                            </span>
                                        </td>
                                        <td className='p-4 text-slate-800'>{p.supplier_name}</td>
                                        <td className='p-4'>
                                            <span className='text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-500 uppercase'>
                                                {p.branch_name}
                                            </span>
                                        </td>
                                        <td className='p-4 text-right font-black text-slate-900'>
                                            ৳{Number(p.grand_total).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className='p-10 text-center text-slate-400 italic'>No data found for the selected branch.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TotalPurchaseReport