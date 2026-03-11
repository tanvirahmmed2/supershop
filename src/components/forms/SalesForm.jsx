'use client'
import React, { useContext, useState } from 'react'
import { Context } from '../helper/Context'
import { toast } from 'react-toastify'
import axios from 'axios'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiUser, FiInfo } from 'react-icons/fi'

const payment_method_options = ['cash', 'bkash', 'nagad', 'card']

const SalesForm = () => {
  const { 
    cart, addToCart, removeFromCart, clearCart, decreaseCartQuantity, staff 
  } = useContext(Context)
  
  const [popUp, setPopUp] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    customer_phone: '',
    manual_discount: 0,
    payment_method: '',
    transaction_id: '',
    notes: ''
  })

  const cartItems = cart?.items || []

  const grossTotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.sale_price || 0) * (item.quantity || 0)), 0
  )

  const totalProductDiscount = cartItems.reduce(
    (acc, item) => acc + (Number(item.discount_price || 0) * (item.quantity || 0)), 0
  )

  const manualDiscount = Number(formData.manual_discount) || 0
  const grandTotal = Math.max(0, grossTotal - totalProductDiscount - manualDiscount)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.payment_method) return toast.error("Select payment method")
    if (!formData.customer_phone) return toast.error("Customer phone is required")
    if (cartItems.length === 0) return toast.error("Cart is empty")

    setLoading(true)
    try {
      const payload = {
        branch_id: staff?.branch_id,
        staff_id: staff?.staff_id,
        customer_phone: formData.customer_phone,
        total_amount: grossTotal,
        discount_amount: totalProductDiscount + manualDiscount,
        grand_total: grandTotal,
        payment_method: formData.payment_method,
        transaction_id: formData.transaction_id,
        notes: formData.notes,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.sale_price,
          discount_per_unit: item.discount_price
        }))
      }

      const res = await axios.post('/api/sales', payload, { withCredentials: true })
      
      if (res.status === 201) {
        toast.success("Sale completed!")
        clearCart()
        setPopUp(false)
        setFormData({ customer_phone: '', manual_discount: 0, payment_method: '', transaction_id: '', notes: '' })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process sale")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full max-w-4xl mx-auto flex flex-col gap-6 p-6 bg-white shadow-md rounded-lg'>
      <div className='flex justify-between items-center border-b pb-4'>
        <h2 className='text-2xl font-bold flex items-center gap-2 text-slate-900'>
          <FiShoppingBag className='text-blue-600' /> NEW SALE
        </h2>
        <div className='text-right'>
          <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Branch</p>
          <p className='font-bold text-slate-700 text-sm'>{staff?.branch_name || "Primary Branch"}</p>
        </div>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='flex flex-col gap-1'>
          <label className='text-xs font-bold text-gray-500 uppercase flex items-center gap-2'>
            <FiUser size={14} /> Customer Phone
          </label>
          <input 
            type="text" 
            name="customer_phone"
            placeholder="01XXXXXXXXX"
            value={formData.customer_phone} 
            onChange={handleInputChange} 
            className='border-2 p-2 rounded-lg focus:border-blue-500 outline-none font-medium'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-xs font-bold text-gray-500 uppercase'>Staff</label>
          <input type="text" disabled value={staff?.name || "Cashier"} className='bg-gray-50 p-2 border rounded-lg text-gray-400' />
        </div>
      </div>

      <div className='overflow-x-auto border rounded-lg'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-gray-50 border-b text-[10px] uppercase text-gray-500 font-black'>
              <th className='p-3'>Product</th>
              <th className='p-3 text-center'>Unit Price</th>
              <th className='p-3 text-center'>Unit Disc</th>
              <th className='p-3 text-center'>Qty</th>
              <th className='p-3 text-right'>Subtotal</th>
              <th className='p-3 text-center'>Action</th>
            </tr>
          </thead>
          <tbody className='divide-y text-sm'>
            {cartItems.map((item) => (
              <tr key={item.product_id} className='hover:bg-gray-50'>
                <td className='p-3'>
                  <p className='font-bold text-slate-800'>{item.name}</p>
                  <p className='text-[10px] text-gray-400'>ID: {item.product_id}</p>
                </td>
                <td className='p-3 text-center font-semibold text-gray-600'>৳{Number(item.sale_price).toFixed(2)}</td>
                <td className='p-1 text-center text-red-500 font-bold'>-৳{Number(item.discount_price).toFixed(2)}</td>
                <td className='p-3'>
                  <div className='flex items-center justify-center gap-3'>
                    <button onClick={() => decreaseCartQuantity(item.product_id)} className='p-1 bg-gray-100 rounded'><FiMinus size={10} /></button>
                    <span className='font-bold'>{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className='p-1 bg-gray-100 rounded'><FiPlus size={10} /></button>
                  </div>
                </td>
                <td className='p-3 text-right font-bold text-slate-900'>
                  ৳{((item.sale_price - item.discount_price) * item.quantity).toFixed(2)}
                </td>
                <td className='p-3 text-center'>
                  <button onClick={() => removeFromCart(item.product_id)} className='text-red-300 hover:text-red-600'>
                    <FiTrash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex flex-col md:flex-row justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300'>
        <div className='flex flex-col gap-2 w-full md:w-1/2'>
            <label className='text-[10px] font-bold uppercase text-gray-400'>Notes</label>
            <textarea name="notes" placeholder="..." onChange={handleInputChange} className='border p-2 rounded-lg h-20 text-sm outline-none' />
        </div>
        <div className='flex flex-col gap-2 w-full md:w-64 text-sm font-medium'>
          <div className='flex justify-between text-gray-500'>
            <span>Gross Total:</span> 
            <span>৳{grossTotal.toFixed(2)}</span>
          </div>
          <div className='flex justify-between text-red-500'>
            <span>Product Discounts:</span> 
            <span>-৳{totalProductDiscount.toFixed(2)}</span>
          </div>
          <div className='flex justify-between items-center py-1'>
            <label className='text-red-600 font-bold uppercase text-[10px]'>Manual Discount:</label>
            <input 
              type="number" 
              name="manual_discount" 
              onChange={handleInputChange} 
              className='w-20 border-b border-red-200 bg-transparent text-right outline-none font-bold' 
            />
          </div>
          <div className='flex justify-between font-black text-xl border-t border-slate-900 pt-2 mt-1 text-slate-900'>
            <span>GRAND TOTAL:</span> 
            <span>৳{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button 
        disabled={cartItems.length === 0}
        onClick={() => setPopUp(true)}
        className='w-full py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-black transition-all'
      >
        COLLECT PAYMENT ৳{grandTotal.toFixed(2)}
      </button>

      {popUp && (
        <div className='fixed inset-0 flex items-center justify-center z- p-4 bg-black/50 backdrop-blur-sm'>
          <div className='relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col gap-5'>
            <div className='text-center'>
              <h3 className='text-xl font-black uppercase text-slate-800'>Checkout</h3>
              <p className='text-2xl font-black text-blue-600 mt-2'>৳{grandTotal.toFixed(2)}</p>
            </div>
            
            <div className='flex flex-col gap-3'>
                <select name="payment_method" onChange={handleInputChange} className='w-full border-2 p-3 rounded-xl font-bold outline-none'>
                  <option value="">Select Method</option>
                  {payment_method_options.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                </select>
                <input type="text" name="transaction_id" placeholder="Transaction ID (Optional)" onChange={handleInputChange} className='w-full border-2 p-3 rounded-xl font-bold outline-none' />
            </div>

            <button onClick={handleSubmit} disabled={loading} className='w-full bg-blue-600 text-white py-4 rounded-xl font-black'>
              {loading ? 'Processing...' : 'CONFIRM SALE'}
            </button>
            <button onClick={() => setPopUp(false)} className='text-gray-400 text-sm font-bold'>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesForm