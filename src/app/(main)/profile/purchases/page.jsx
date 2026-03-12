'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { printSalesInvoice } from '@/lib/print/saleInvoicePrint'

const OrdersPage = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getPurchases = async () => {
            try {
                const res = await axios.get('/api/user/purchase', { withCredentials: true })
                if (res.data.success) {
                    setOrders(res.data.payload)
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || "Could not load order history")
            } finally {
                setLoading(false)
            }
        }
        getPurchases()
    }, [])

    if (loading) {
        return (
            <div className='w-full h-screen flex items-center justify-center'>
                <div className='animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full'></div>
            </div>
        )
    }

    return (
        <div className='max-w-6xl mx-auto p-4 md:p-10'>
            <div className='mb-10'>
                <h1 className='text-3xl font-bold'>My Purchases</h1>
                <p className='text-gray-500'>View details and download your official receipts</p>
            </div>

            {orders.length === 0 ? (
                <div className='w-full py-20 text-center border-2 border-dashed rounded-xl'>
                    <p className='text-gray-400'>You haven't made any purchases yet.</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 gap-4'>
                    <div className='hidden md:grid grid-cols-5 px-6 py-3 font-semibold text-gray-600 border-b'>
                        <span>Invoice No</span>
                        <span>Date</span>
                        <span>Payment</span>
                        <span>Total Amount</span>
                        <span className='text-right'>Action</span>
                    </div>

                    {orders.map((order) => (
                        <div 
                            key={order.invoice_no} 
                            className='flex flex-col md:grid md:grid-cols-5 items-center bg-white p-4 md:px-6 md:py-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'
                        >
                            <span className='font-bold text-blue-600 uppercase'>#{order.invoice_no}</span>
                            
                            <span className='text-gray-600'>
                                {new Date(order.created_at).toLocaleDateString('en-GB')}
                            </span>
                            
                            <span className='capitalize text-gray-500'>
                                {order.payment_method || 'Cash'}
                            </span>
                            
                            <span className='font-bold text-gray-900'>
                                ৳{Number(order.grand_total).toFixed(2)}
                            </span>

                            <div className='w-full md:w-auto flex justify-end mt-4 md:mt-0'>
                                <button 
                                    onClick={() => printSalesInvoice(order)}
                                    className='w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    Download Slip
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default OrdersPage