'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { FiArrowLeft, FiDownload } from 'react-icons/fi'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { printPurchaseInvoice } from '@/lib/print/purchaseInvoicePrint'

const PurchaseInvoicePage = () => {
  const { invoice_no } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const res = await axios.get(`/api/purchase/${invoice_no}`)
        if (res.data.success) {
          setData(res.data.payload)
        }
      } catch (error) {
        toast.error("Could not load invoice details")
      } finally {
        setLoading(false)
      }
    }
    if (invoice_no) fetchInvoiceDetails()
  }, [invoice_no])

  if (loading) return <div className='p-10 text-center font-mono'>Loading Invoice...</div>
  if (!data) return <div className='p-10 text-center text-red-500'>Invoice Not Found</div>

  return (
    <div className=' min-h-screen p-4 md:p-8 pb-20'>
      <div className='max-w-4xl mx-auto mb-6 flex justify-between items-center'>
        <Link href="/purchase/list" className='flex items-center gap-2 text-gray-600 hover:text-black transition-all'>
          <FiArrowLeft /> Back to List
        </Link>
        <button onClick={()=>printPurchaseInvoice(data)} className='flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-all'>
          <FiDownload /> Print
        </button>
      </div>

      <div className='max-w-4xl mx-auto bg-white shadow-xl rounded-sm p-8 md:p-12 border-t-10 border-black'>
        <div className='flex flex-col md:flex-row justify-between gap-8 mb-12'>
          <div>
            <h1 className='text-4xl font-black tracking-tighter mb-2'>SUPER SHOP</h1>
            <p className='text-gray-500 text-sm uppercase tracking-widest font-bold'>{data.branch_name}</p>
            <p className='text-gray-500 text-sm'>{data.branch_location}</p>
            <p className='text-gray-500 text-sm'>Phone: {data.branch_phone}</p>
          </div>
          <div className='text-left md:text-right'>
            <h2 className='text-2xl font-bold text-gray-800 uppercase'>Purchase Invoice</h2>
            <p className='text-gray-500 font-mono text-sm mt-1'>#{data.invoice_no}</p>
            <div className='mt-4'>
              <p className='text-xs text-gray-400 uppercase font-bold'>Date Issued</p>
              <p className='font-medium text-gray-800'>{new Date(data.created_at).toLocaleDateString('en-GB', { dateStyle: 'long' })}</p>
            </div>
          </div>
        </div>

        <hr className='border-gray-100 mb-8' />

        <div className='grid grid-cols-2 gap-8 mb-12'>
          <div>
            <p className='text-xs text-gray-400 uppercase font-bold mb-2'>Supplier Details</p>
            <p className='font-bold text-gray-900 text-lg'>{data.supplier_name}</p>
            <p className='text-gray-600'>{data.supplier_phone}</p>
            <p className='text-gray-600'>{data.supplier_email}</p>
          </div>
          <div className='text-right'>
            <p className='text-xs text-gray-400 uppercase font-bold mb-2'>Purchased By</p>
            <p className='font-medium text-gray-900'>{data.staff_name}</p>
            <p className='text-gray-500 text-sm italic'>Role: {data.role}</p>
          </div>
        </div>

        <div className='mb-10'>
          <table className='w-full text-left'>
            <thead>
              <tr className='border-b-2 border-black text-xs uppercase font-black'>
                <th className='py-3'>Description</th>
                <th className='py-3 text-center'>Barcode</th>
                <th className='py-3 text-center'>Qty</th>
                <th className='py-3 text-right'>Unit Price</th>
                <th className='py-3 text-right'>Amount</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {data.items?.map((item, index) => (
                <tr key={index} className='text-gray-800'>
                  <td className='py-4 font-medium'>{item.product_name}</td>
                  <td className='py-4 text-center text-sm font-mono'>{item.barcode}</td>
                  <td className='py-4 text-center'>{item.quantity}</td>
                  <td className='py-4 text-right'>৳{Number(item.purchase_price).toFixed(2)}</td>
                  <td className='py-4 text-right font-bold'>৳{(item.quantity * item.purchase_price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='flex justify-end border-t-2 border-gray-50 pt-6'>
          <div className='w-full md:w-64 space-y-3'>
            <div className='flex justify-between text-gray-600'>
              <span>Subtotal:</span>
              <span>৳{Number(data.total_amount).toFixed(2)}</span>
            </div>
            <div className='flex justify-between text-gray-600'>
              <span>Shipping:</span>
              <span>৳{Number(data.shipping_cost).toFixed(2)}</span>
            </div>
            <div className='flex justify-between text-red-500'>
              <span>Discount:</span>
              <span>-৳{Number(data.discount).toFixed(2)}</span>
            </div>
            <div className='flex justify-between text-xl font-black border-t-2 border-black pt-3'>
              <span>TOTAL:</span>
              <span>৳{Number(data.grand_total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className='mt-20'>
          <p className='text-xs text-gray-400 uppercase font-bold mb-2'>Remarks / Notes</p>
          <p className='text-sm text-gray-600 italic'>{data.notes || "No additional notes provided."}</p>
        </div>
      </div>
    </div>
  )
}

export default PurchaseInvoicePage