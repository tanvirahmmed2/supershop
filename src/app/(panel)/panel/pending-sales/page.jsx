'use client'
import React, { useEffect, useState, useContext } from 'react'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiTrash2, FiEye, FiSearch, FiPrinter, FiLoader, FiShoppingBag, FiCheckCircle, FiTruck, FiMapPin } from 'react-icons/fi'
import { printSalesInvoice } from '@/lib/print/saleInvoicePrint'


const PendingSalesPage = () => {
    const { staff } = useContext(Context)
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(null)
    const [printingNo, setPrintingNo] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    const fetchSales = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`/api/checkout`, { withCredentials: true })
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
        if (staff?.branch_id) fetchSales()
    }, [staff?.branch_id])

   const handlePrintRequest = async (sale) => {
    setPrintingNo(sale.invoice_no);
    try {
        const res = await axios.get(`/api/checkout/${sale.invoice_no}`, { withCredentials: true });
        
        if (res.data.success) {
            let printData = res.data.payload;
            if (!printData.items || printData.items.length === 0) {
                try {
                    const parsedItems = JSON.parse(sale.notes);
                    printData.items = parsedItems.map(item => ({
                        product_name: item.name || item.product_name,
                        quantity: item.quantity,
                        unit_price: item.sale_price - (item.discount_price || 0),
                        sub_total: (item.sale_price - (item.discount_price || 0)) * item.quantity
                    }));
                } catch (e) {
                    console.error("Failed to parse items from notes:", e);
                    toast.error("Item data is corrupted in notes.");
                    return;
                }
            }

           printSalesInvoice(printData);
            
        } else {
            toast.error("Invoice details not found");
        }
    } catch (error) {
        console.error("Print fetch error:", error);
        toast.error("Failed to fetch print data");
    } finally {
        setPrintingNo(null);
    }
};

    const handleOrderAction = async (id, action) => {
        const msg = action === 'confirm' 
            ? "Confirm order? Items will be recorded and stock will be deducted." 
            : "Mark as Completed? This confirms payment collection and delivery."
        
        if (!confirm(msg)) return

        setActionLoading(id)
        try {
            const res = await axios.patch('/api/checkout', { sale_id: id, action })
            if (res.data.success) {
                toast.success(res.data.message)
                fetchSales()
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Action failed")
        } finally {
            setActionLoading(null)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("Permanently delete this pending order? This cannot be undone.")) return
        try {
            const res = await axios.delete(`/api/checkout?sale_id=${id}`)
            if (res.data.success) {
                toast.success("Order removed")
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

    return (
        <div className='w-full p-6 flex flex-col gap-6 bg-[#fcfcfc] min-h-screen'>
            
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h1 className='text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase'>
                        <FiShoppingBag className='text-orange-500'/> Pending Workflow
                    </h1>
                    <p className='text-sm text-slate-500 font-medium tracking-tight'>Review, Confirm Stock, and Finalize Orders</p>
                </div>
                
                <div className='relative w-full md:w-96'>
                    <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
                    <input 
                        type="text" 
                        placeholder="Search Invoice or Phone..." 
                        className='w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all shadow-sm'
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className='bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left border-collapse'>
                        <thead>
                            <tr className='bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-black tracking-widest'>
                                <th className='p-6'>Invoice Details</th>
                                <th className='p-6'>Customer Info</th>
                                <th className='p-6 text-right'>Grand Total</th>
                                <th className='p-6 text-center'>State</th>
                                <th className='p-6 text-right'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-50'>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className='p-20 text-center'>
                                        <FiLoader className='animate-spin mx-auto text-orange-500' size={30} />
                                    </td>
                                </tr>
                            ) : filteredSales.length > 0 ? (
                                filteredSales.map((s) => {
                                    const isUnconfirmed = parseInt(s.items_count) === 0;
                                    return (
                                        <tr key={s.sale_id} className='hover:bg-slate-50/50 transition-all group'>
                                            <td className='p-6'>
                                                <span className='font-mono font-black text-orange-600 text-xs bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 mb-1 inline-block'>
                                                    {s.invoice_no}
                                                </span>
                                                <p className='text-[10px] text-slate-400 font-bold uppercase'>
                                                    {new Date(s.sale_date).toLocaleDateString()}
                                                </p>
                                            </td>
                                            <td className='p-6'>
                                                <p className='text-sm font-black text-slate-800 leading-tight uppercase'>{s.customer_name || 'Anonymous'}</p>
                                                <p className='text-xs text-slate-500 font-medium mb-1'>{s.customer_phone}</p>
                                                <div className='flex items-center gap-1 text-[10px] text-slate-400 max-w-50'>
                                                    <FiMapPin size={10} className='shrink-0' />
                                                    <span className='truncate italic'>{s.customer_address}</span>
                                                </div>
                                            </td>
                                            <td className='p-6 text-right font-black text-slate-900'>
                                                ৳{Number(s.grand_total).toLocaleString()}
                                            </td>
                                            <td className='p-6 text-center'>
                                                {isUnconfirmed ? (
                                                    <span className='bg-blue-50 text-blue-600 text-[9px] px-2 py-1 rounded-md font-black border border-blue-100 uppercase tracking-tighter'>Review Required</span>
                                                ) : (
                                                    <span className='bg-green-50 text-green-600 text-[9px] px-2 py-1 rounded-md font-black border border-green-100 uppercase tracking-tighter'>Ready to Deliver</span>
                                                )}
                                            </td>
                                            <td className='p-6'>
                                                <div className='flex items-center justify-end gap-2'>
                                                    {isUnconfirmed ? (
                                                        <button 
                                                            onClick={() => handleOrderAction(s.sale_id, 'confirm')}
                                                            disabled={actionLoading === s.sale_id}
                                                            className='bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-slate-200'
                                                        >
                                                            {actionLoading === s.sale_id ? <FiLoader className='animate-spin'/> : <FiCheckCircle />}
                                                            CONFIRM
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleOrderAction(s.sale_id, 'complete')}
                                                            disabled={actionLoading === s.sale_id}
                                                            className='bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-100'
                                                        >
                                                            {actionLoading === s.sale_id ? <FiLoader className='animate-spin'/> : <FiTruck />}
                                                            DELIVERED
                                                        </button>
                                                    )}

                                                    <button 
                                                        onClick={() => handlePrintRequest(s)} 
                                                        className='p-2.5 text-slate-400 hover:text-blue-600 transition-all'
                                                        title="Print Invoice"
                                                    >
                                                        <FiPrinter size={18} />
                                                    </button>

                                                    <button 
                                                        onClick={() => handleDelete(s.sale_id)}
                                                        className='p-2.5 text-slate-300 hover:text-red-600 transition-all'
                                                        title="Delete Order"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className='p-20 text-center text-slate-300 font-black uppercase tracking-[0.3em] text-[10px]'>
                                        No pending tasks for this branch
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

export default PendingSalesPage