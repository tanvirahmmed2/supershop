'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../helper/Context'
import { toast } from 'react-toastify'
import axios from 'axios'

const payment_method_options = ['bkash', 'nagad', 'card', 'cash']

const PurchaseForm = () => {
  const { 
    suppliers, fetchSuppliers, 
    purchase, setPurchase,
    removeFromPurchase, 
    staff, setSupplierBox, clearPurchase 
  } = useContext(Context)
  
  const [popUp, setPopUp] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    supplier_id: '',
    shipping_cost: 0,
    discount: 0,
    payment_method: '',
    transaction_id: '',
    notes: ''
  })

  useEffect(() => { fetchSuppliers() }, [])

  const updateItemDetails = (id, field, value) => {
    setPurchase(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.product_id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const totalAmount = purchase?.items?.reduce((acc, item) => acc + (Number(item.purchase_price) * item.quantity), 0) || 0
  const shipping = Number(formData.shipping_cost) || 0
  const discount = Number(formData.discount) || 0
  const grandTotal = totalAmount + shipping - discount

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.supplier_id || !formData.payment_method) {
      return toast.error("Please select a supplier and payment method")
    }

    setLoading(true)
    try {
      const payload = {
        branch_id: staff?.branch_id,
        supplier_id: Number(formData.supplier_id),
        staff_id: staff?.staff_id,
        total_amount: totalAmount,
        discount: discount,
        shipping_cost: shipping,
        grand_total: grandTotal,
        payment_method: formData.payment_method,
        transaction_id: formData.transaction_id,
        notes: formData.notes,
        items: purchase.items 
      }

      const res = await axios.post('/api/purchase', payload, {withCredentials:true})
      
      if (res.status === 201) {
        toast.success("Purchase recorded and inventory updated!")
        clearPurchase()
        setPopUp(false)
        setFormData({ supplier_id: '', shipping_cost: 0, discount: 0, payment_method: '', transaction_id: '', notes: '' })
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to process purchase")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full max-w-4xl mx-auto flex flex-col gap-6 p-6 bg-white shadow-md rounded-lg'>
      <h2 className='text-2xl font-bold border-b pb-2'>New Stock Purchase</h2>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between'>
            <label className='font-semibold'>Select Supplier</label>
            <button onClick={() => setSupplierBox(true)} className='text-xs bg-blue-500 text-white px-2 rounded'>+ Add New</button>
          </div>
          <select 
            name="supplier_id" 
            value={formData.supplier_id} 
            onChange={handleInputChange} 
            className='border p-2 rounded focus:ring-2 focus:ring-black outline-none'
          >
            <option value="">-- Choose Supplier --</option>
            {suppliers?.map((s) => (
              <option value={s.supplier_id} key={s.supplier_id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Branch</label>
          <input 
            type="text" 
            disabled 
            value={staff?.branch_name || "Assigned Branch"} 
            className='bg-gray-100 p-2 border rounded text-gray-500' 
          />
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='p-2 border'>Product</th>
              <th className='p-2 border text-center w-32'>Price (৳)</th>
              <th className='p-2 border text-center w-24'>Qty</th>
              <th className='p-2 border text-right'>Subtotal</th>
              <th className='p-2 border text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {purchase.items?.map((item) => (
              <tr key={item.product_id} className='hover:bg-gray-50'>
                <td className='p-2 border font-medium'>{item.name}</td>
                <td className='p-2 border text-center'>
                  <input 
                    type="number" 
                    value={item.purchase_price}
                    onChange={(e) => updateItemDetails(item.product_id, 'purchase_price', Number(e.target.value))}
                    className='w-full text-center border rounded p-1 focus:border-black outline-none'
                  />
                </td>
                <td className='p-2 border text-center'>
                  <input 
                    type="number" 
                    value={item.quantity}
                    onChange={(e) => updateItemDetails(item.product_id, 'quantity', Number(e.target.value))}
                    className='w-full text-center border rounded p-1 focus:border-black outline-none'
                  />
                </td>
                <td className='p-2 border text-right'>৳{(item.purchase_price * item.quantity).toFixed(2)}</td>
                <td className='p-2 border text-center'>
                  <button 
                    onClick={() => removeFromPurchase(item.product_id)} 
                    className='px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600'
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex flex-col md:flex-row justify-between gap-4 bg-gray-50 p-4 rounded'>
        <div className='flex flex-col gap-3 w-full md:w-1/2'>
            <label className='text-sm font-semibold'>Notes</label>
            <textarea name="notes" placeholder="Enter purchase remarks..." onChange={handleInputChange} className='border p-2 rounded h-24 text-sm' />
        </div>
        <div className='flex flex-col gap-2 w-full md:w-64'>
          <div className='flex justify-between'><span>Subtotal:</span> <span>৳{totalAmount.toFixed(2)}</span></div>
          <div className='flex justify-between items-center'>
            <label>Shipping:</label>
            <input type="number" name="shipping_cost" value={formData.shipping_cost} onChange={handleInputChange} className='w-24 border text-right p-1' />
          </div>
          <div className='flex justify-between items-center'>
            <label>Discount:</label>
            <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className='w-24 border text-right p-1' />
          </div>
          <div className='flex justify-between font-bold text-lg border-t pt-2'>
            <span>Grand Total:</span> <span>৳{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button 
        disabled={purchase.items.length === 0}
        onClick={() => setPopUp(true)}
        className='w-full py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:bg-gray-300'
      >
        Proceed to Payment
      </button>

      {popUp && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div className='absolute inset-0 bg-black/50' onClick={() => setPopUp(false)}></div>
          <div className='relative bg-white p-8 rounded-xl shadow-2xl w-96 flex flex-col gap-4'>
            <h3 className='text-xl font-bold'>Finalize Purchase</h3>
            <div className='bg-gray-100 p-3 rounded'>
                <p className='text-sm text-gray-600'>Grand Total</p>
                <p className='text-2xl font-bold text-black'>৳{grandTotal.toFixed(2)}</p>
            </div>
            
            <div>
                <label className='text-xs font-bold uppercase text-gray-500'>Payment Method</label>
                <select name="payment_method" onChange={handleInputChange} className='w-full border p-2 rounded mt-1'>
                  <option value="">-- Select Method --</option>
                  {payment_method_options.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                </select>
            </div>

            <div>
                <label className='text-xs font-bold uppercase text-gray-500'>Transaction ID</label>
                <input type="text" name="transaction_id" placeholder="Ex: TRX123456" onChange={handleInputChange} className='w-full border p-2 rounded mt-1' />
            </div>

            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className='bg-black text-white py-3 rounded font-semibold mt-2 hover:bg-gray-800'
            >
              {loading ? 'Processing...' : 'Confirm & Save Purchase'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchaseForm