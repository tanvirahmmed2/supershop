'use client'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FiTrash2, FiRotateCcw, FiEye, FiSearch, FiPrinter, FiLoader } from 'react-icons/fi'
import Link from 'next/link'
import { printPurchaseInvoice } from '@/lib/print/purchaseInvoicePrint'

const PurchaseListPage = () => {
  const { staff } = useContext(Context)
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [printingNo, setPrintingNo] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchPurchases = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`/api/purchase`, { withCredentials: true })
      if (res.data.success) {
        setPurchases(res.data.payload)
      }
    } catch (error) {
      setPurchases([])
      console.error("Fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPurchases()
  }, [staff?.branch_id])

  const handlePrintRequest = async (invoice_no) => {
    setPrintingNo(invoice_no)
    try {
      const res = await axios.get(`/api/purchase/${invoice_no}`, { withCredentials: true })
      if (res.data.success) {
        printPurchaseInvoice(res.data.payload)
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
    if (!confirm("Mark this purchase as RETURNED? This will decrease branch inventory.")) return
    try {
      const res = await axios.patch('/api/purchase', { 
        purchase_id: id, 
        purchase_status: 'returned' 
      })
      if (res.data.success) {
        toast.success(res.data.message)
        fetchPurchases()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this purchase? Inventory will be adjusted automatically.")) return
    try {
      const res = await axios.delete('/api/purchase', { data: { id } })
      if (res.data.success) {
        toast.success(res.data.message)
        fetchPurchases()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed")
    }
  }

  const filteredPurchases = purchases?.filter(p => 
    p.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status) => {
    const styles = {
      received: 'bg-green-100 text-green-700 border-green-200',
      returned: 'bg-red-100 text-red-700 border-red-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
    return `px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styles[status] || 'bg-gray-100'}`
  }

  return (
    <div className='w-full p-6 flex flex-col gap-6 bg-[#f8f9fa] min-h-screen'>
      
      {/* Header & Search */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-black text-slate-800 tracking-tight'>PURCHASE HISTORY</h1>
          <p className='text-sm text-slate-500 font-medium'>Manage stock inflows and branch inventory records</p>
        </div>
        
        <div className='relative w-full md:w-80'>
          <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
          <input 
            type="text" 
            placeholder="Search Invoice or Supplier..." 
            className='w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-black transition-all shadow-sm'
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-black tracking-widest'>
                <th className='p-4'>Date</th>
                <th className='p-4'>Invoice Number</th>
                <th className='p-4'>Supplier</th>
                <th className='p-4'>Branch</th>
                <th className='p-4 text-right'>Total Amount</th>
                <th className='p-4 text-center'>Status</th>
                <th className='p-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {loading ? (
                <tr>
                  <td colSpan="7" className='p-20 text-center text-slate-400'>
                    <div className='flex flex-col items-center gap-2'>
                       <FiLoader className='animate-spin' size={24} />
                       <span className='text-sm font-medium'>Syncing Records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPurchases.length > 0 ? (
                filteredPurchases.map((p) => (
                  <tr key={p.purchase_id} className='hover:bg-slate-50/50 transition-colors group'>
                    <td className='p-4 text-sm text-slate-600 whitespace-nowrap font-medium'>
                      {new Date(p.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className='p-4'>
                      <span className='font-mono font-bold text-slate-800 uppercase text-xs bg-slate-100 px-2 py-1 rounded'>
                        {p.invoice_no}
                      </span>
                    </td>
                    <td className='p-4 text-sm font-semibold text-slate-700'>{p.supplier_name}</td>
                    <td className='p-4 text-xs font-medium text-slate-500 uppercase'>{p.branch_name}</td>
                    <td className='p-4 text-sm font-black text-right text-slate-900'>
                      ৳{Number(p.grand_total).toLocaleString()}
                    </td>
                    <td className='p-4 text-center'>
                      <span className={getStatusBadge(p.purchase_status)}>
                        {p.purchase_status}
                      </span>
                    </td>
                    <td className='p-4'>
                      <div className='flex items-center justify-end gap-2'>
                        {/* Print Button with Loading state */}
                        <button 
                          onClick={() => handlePrintRequest(p.invoice_no)} 
                          disabled={printingNo === p.invoice_no}
                          title="Generate Print" 
                          className='p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition-all disabled:opacity-30'
                        >
                          {printingNo === p.invoice_no ? (
                            <FiLoader className='animate-spin' size={16} />
                          ) : (
                            <FiPrinter size={16} />
                          )}
                        </button>

                        <Link 
                          href={`/panel/purchase/${p.invoice_no}`} 
                          title="View Digital Invoice" 
                          className='p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all'
                        >
                          <FiEye size={18} />
                        </Link>
                        
                        {p.purchase_status !== 'returned' && (
                          <button 
                            onClick={() => handleReturn(p.purchase_id)}
                            title="Return Stock" 
                            className='p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all'
                          >
                            <FiRotateCcw size={18} />
                          </button>
                        )}
                        
                        <button 
                          onClick={() => handleDelete(p.purchase_id)}
                          title="Archive/Delete" 
                          className='p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all'
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className='p-20 text-center text-slate-400 italic font-medium'>
                    No records found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className='flex justify-between items-center px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
        <p>Total {filteredPurchases.length} Records found</p>
        <p>Base Currency: BDT (৳)</p>
      </div>
    </div>
  )
}

export default PurchaseListPage