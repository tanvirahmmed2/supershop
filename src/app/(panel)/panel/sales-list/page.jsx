'use client'
import React, { useEffect, useState, useContext } from 'react'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiTrash2, FiRotateCcw, FiEye, FiSearch, FiPrinter, FiLoader, FiShoppingBag } from 'react-icons/fi'
import Link from 'next/link'
import { printSalesInvoice } from '@/lib/print/saleInvoicePrint'

const SalesListPage = () => {
  const { staff } = useContext(Context)
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [printingNo, setPrintingNo] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchSales = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`/api/sales/branch`, { withCredentials: true })
      if (res.data.success) {
        setSales(res.data.payload)
      }
    } catch (error) {
      setSales([])
      console.error("Fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [staff?.branch_id])

  const handlePrintRequest = async (invoice_no) => {
    setPrintingNo(invoice_no)
    try {
      const res = await axios.get(`/api/sales/${invoice_no}`, { withCredentials: true })
      if (res.data.success) {
        printSalesInvoice(res.data.payload)
      } else {
        toast.error("Invoice details not found")
      }
    } catch (error) {
      toast.error("Failed to fetch print data")
    } finally {
      setPrintingNo(null)
    }
  }

  const handleReturn = async (id) => {
    if (!confirm("Process RETURN for this sale? Stock will be restored to inventory.")) return
    try {
      const res = await axios.patch('/api/sales', { sale_id: id })
      if (res.data.success) {
        toast.success(res.data.message)
        fetchSales()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Return failed")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this sale record? Inventory will be adjusted if not already returned.")) return
    try {
      const res = await axios.delete('/api/sales', { data: { sale_id: id } })
      if (res.data.success) {
        toast.success(res.data.message)
        fetchSales()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed")
    }
  }

  const filteredSales = sales?.filter(s => 
    s.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.customer_phone?.includes(searchTerm) ||
    (s.customer_name && s.customer_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700 border-green-200',
      returned: 'bg-red-100 text-red-700 border-red-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
    return `px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${styles[status] || 'bg-gray-100'}`
  }

  return (
    <div className='w-full p-6 flex flex-col gap-6 bg-[#fcfcfc] min-h-screen'>
      
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2'>
            <FiShoppingBag className='text-blue-600'/> SALES HISTORY
          </h1>
          <p className='text-sm text-slate-500 font-medium'>Track POS transactions, returns, and revenue logs</p>
        </div>
        
        <div className='relative w-full md:w-96'>
          <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
          <input 
            type="text" 
            placeholder="Search Invoice, Phone or Name..." 
            className='w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm font-medium'
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className='bg-white rounded-8 shadow-sm border border-slate-100 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left'>
            <thead>
              <tr className='bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]'>
                <th className='p-6'>Date</th>
                <th className='p-6'>Invoice</th>
                <th className='p-6'>Customer</th>
                <th className='p-6 text-right'>Grand Total</th>
                <th className='p-6 text-center'>Status</th>
                <th className='p-6 text-right'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-50'>
              {loading ? (
                <tr>
                  <td colSpan="6" className='p-20 text-center text-slate-400'>
                    <div className='flex flex-col items-center gap-2'>
                        <FiLoader className='animate-spin text-blue-600' size={32} />
                        <span className='text-xs font-black uppercase tracking-widest'>Accessing Ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSales.length > 0 ? (
                filteredSales.map((s) => (
                  <tr key={s.sale_id} className='hover:bg-slate-50/50 transition-all group'>
                    <td className='p-6'>
                      <p className='text-sm font-bold text-slate-700'>{new Date(s.created_at).toLocaleDateString('en-GB')}</p>
                      <p className='text-[10px] text-slate-400 font-medium'>{new Date(s.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </td>
                    <td className='p-6'>
                      <span className='font-mono font-black text-blue-600 uppercase text-xs bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100'>
                        {s.invoice_no}
                      </span>
                    </td>
                    <td className='p-6'>
                      <p className='text-sm font-black text-slate-800'>{s.customer_name || 'Walk-in Customer'}</p>
                      <p className='text-xs text-slate-500 font-medium'>{s.customer_phone || 'No Phone'}</p>
                    </td>
                    <td className='p-6 text-right font-black text-slate-900 text-lg'>
                      ৳{Number(s.grand_total).toLocaleString()}
                    </td>
                    <td className='p-6 text-center'>
                      <span className={getStatusBadge(s.sale_status)}>
                        {s.sale_status}
                      </span>
                    </td>
                    <td className='p-6'>
                      <div className='flex items-center justify-end gap-1'>
                        <button 
                          onClick={() => handlePrintRequest(s.invoice_no)} 
                          disabled={printingNo === s.invoice_no}
                          className='p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-30'
                        >
                          {printingNo === s.invoice_no ? <FiLoader className='animate-spin'/> : <FiPrinter size={18} />}
                        </button>

                        <Link 
                          href={`/panel/sales/${s.invoice_no}`} 
                          className='p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all'
                        >
                          <FiEye size={20} />
                        </Link>
                        
                        {s.sale_status !== 'returned' && (
                          <button 
                            onClick={() => handleReturn(s.sale_id)}
                            className='p-2.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all'
                          >
                            <FiRotateCcw size={18} />
                          </button>
                        )}
                        
                        <button 
                          onClick={() => handleDelete(s.sale_id)}
                          className='p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all'
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className='p-20 text-center'>
                    <p className='text-slate-300 font-black uppercase tracking-widest text-xs'>No transactions found</p>
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

export default SalesListPage