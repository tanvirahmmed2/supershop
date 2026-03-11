'use client'
import React, { use, useEffect, useState } from 'react'
import axios from 'axios'
import { FiArrowLeft, FiPrinter, FiCheckCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { printSalesInvoice } from '@/lib/print/saleInvoicePrint'

const SalesInvoicePage = ({params}) => {
  const { invoice_no } = use(params)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const res = await axios.get(`/api/sales/${invoice_no}`)
        if (res.data.success) {
          setData(res.data.payload)
        }
      } catch (error) {
        toast.error("Could not load sale details")
      } finally {
        setLoading(false)
      }
    }
    if (invoice_no) fetchInvoiceDetails()
  }, [invoice_no])

  if (loading) return <div className='p-10 text-center font-mono animate-pulse'>Loading Sale Record...</div>
  if (!data) return <div className='p-10 text-center text-red-500'>Sale Record Not Found</div>

  return (
    <div className='min-h-screen p-4 md:p-8 pb-20 bg-gray-50'>
      <div className='max-w-4xl mx-auto mb-6 flex justify-between items-center'>
        <Link href="/dashboard/sales" className='flex items-center gap-2 text-gray-600 hover:text-black transition-all font-bold'>
          <FiArrowLeft /> POS History
        </Link>
        <button 
          onClick={() => printSalesInvoice(data)} 
          className='flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all font-black uppercase text-xs tracking-widest'
        >
          <FiPrinter /> Print Receipt
        </button>
      </div>

      <div className='max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100'>
       
        <div className='bg-slate-900 p-8 md:p-12 text-white flex flex-col md:flex-row justify-between gap-8'>
          <div>
            <h1 className='text-4xl font-black tracking-tighter mb-2'>SUPER SHOP</h1>
            <div className='flex items-center gap-2 text-blue-400 mb-4'>
                <FiCheckCircle />
                <span className='uppercase text-xs font-black tracking-widest'>Official Sales Receipt</span>
            </div>
            <p className='text-slate-400 text-sm uppercase font-bold'>{data.branch_name}</p>
            <p className='text-slate-500 text-sm'>{data.branch_location}</p>
          </div>
          <div className='text-left md:text-right flex flex-col justify-end'>
            <p className='text-slate-500 text-xs uppercase font-black mb-1'>Invoice Number</p>
            <h2 className='text-2xl font-mono font-bold text-white'>#{data.invoice_no}</h2>
            <div className='mt-4'>
              <p className='text-xs text-slate-500 uppercase font-bold'>Date of Sale</p>
              <p className='font-medium'>{new Date(data.created_at).toLocaleDateString('en-GB', { dateStyle: 'long' })}</p>
            </div>
          </div>
        </div>

        <div className='p-8 md:p-12'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 pb-8 border-b border-gray-100'>
            <div>
                <p className='text-[10px] text-gray-400 uppercase font-black mb-2 tracking-widest'>Billed To (Customer)</p>
                <p className='font-black text-gray-900 text-xl'>{data.customer_name || 'Walk-in Customer'}</p>
                <p className='text-gray-500 font-bold'>{data.customer_phone}</p>
                {data.customer_points && (
                    <span className='inline-block mt-2 bg-green-50 text-green-600 text-[10px] px-2 py-1 rounded-md font-black uppercase'>
                        Loyalty Points: {data.customer_points}
                    </span>
                )}
            </div>
            <div className='text-left md:text-right'>
                <p className='text-[10px] text-gray-400 uppercase font-black mb-2 tracking-widest'>Served By</p>
                <p className='font-bold text-gray-900 text-lg'>{data.staff_name}</p>
                <p className='text-gray-500 text-sm uppercase tracking-widest'>Terminal ID: {data.staff_id}</p>
            </div>
            </div>

            <div className='mb-10'>
            <table className='w-full text-left'>
                <thead>
                <tr className='border-b-2 border-slate-900 text-[10px] uppercase font-black text-slate-400 tracking-widest'>
                    <th className='py-4'>Product Description</th>
                    <th className='py-4 text-center'>Qty</th>
                    <th className='py-4 text-right'>Unit Price</th>
                    <th className='py-4 text-right'>Total</th>
                </tr>
                </thead>
                <tbody className='divide-y divide-gray-50'>
                {data.items?.map((item, index) => (
                    <tr key={index} className='text-gray-800 group'>
                    <td className='py-5'>
                        <p className='font-bold text-slate-800 text-base'>{item.product_name}</p>
                        <p className='text-[10px] text-gray-400 font-mono tracking-tighter'>SKU: {item.product_id}</p>
                    </td>
                    <td className='py-5 text-center font-bold'>{item.quantity}</td>
                    <td className='py-5 text-right font-medium text-slate-500'>৳{Number(item.unit_price).toFixed(2)}</td>
                    <td className='py-5 text-right font-black text-slate-900'>৳{(item.quantity * item.unit_price).toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            <div className='flex flex-col md:flex-row justify-between items-start pt-10 border-t-4 border-double border-gray-100'>
                <div className='max-w-xs'>
                    <p className='text-[10px] text-gray-400 uppercase font-black mb-2 tracking-widest'>Payment Information</p>
                    <div className='flex items-center gap-3 bg-slate-50 p-4 rounded-2xl'>
                        <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm font-black text-slate-800 uppercase text-[10px]'>
                            {data.payment_method?.slice(0, 2)}
                        </div>
                        <div>
                            <p className='font-black text-slate-800 uppercase text-xs'>{data.payment_method}</p>
                            <p className='text-[10px] text-slate-400 font-mono'>{data.transaction_id || 'CASH_TRANSACTION'}</p>
                        </div>
                    </div>
                </div>

                <div className='w-full md:w-80 mt-8 md:mt-0 space-y-4'>
                    <div className='flex justify-between text-slate-400 font-bold text-sm'>
                        <span>Subtotal:</span>
                        <span>৳{Number(data.total_amount).toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between text-red-500 font-bold text-sm bg-red-50 p-2 rounded-lg'>
                        <span>Total Savings:</span>
                        <span>-৳{Number(data.discount_amount).toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between text-3xl font-black text-slate-900 border-t-2 border-slate-100 pt-4'>
                        <span>GRAND TOTAL:</span>
                        <span>৳{Number(data.grand_total).toFixed(2)}</span>
                    </div>
                    <p className='text-[10px] text-right text-gray-400 font-bold italic tracking-tight'>
                        * All prices are inclusive of applicable VAT/Tax
                    </p>
                </div>
            </div>

            <div className='mt-20 text-center border-t border-gray-50 pt-10'>
                <p className='text-sm text-slate-400 font-medium mb-1'>Thank you for shopping with us!</p>
                <p className='text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]'>www.supershop.com</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default SalesInvoicePage