'use client'
import React, { useContext, useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { HiOutlineMapPin, HiOutlinePhone, HiOutlineShoppingBag } from 'react-icons/hi2'
import { Context } from '@/components/helper/Context'

const CheckOutPage = () => {
    const { cart, clearCart, user } = useContext(Context)
    const router = useRouter()
    
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        address: '',
        alt_phone: '',
        notes: ''
    })

    const deliveryFee = 120
    const subtotal = cart.items.reduce((acc, item) => 
        acc + (item.sale_price - item.discount_price) * item.quantity, 0
    )
    const grandTotal = subtotal + deliveryFee

   

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (cart.items.length === 0) return toast.error("Your cart is empty")
        
        setLoading(true)
        try {
            const res = await axios.post('/api/checkout', {
                ...formData,
                items: cart.items,
            }, { withCredentials: true })

            if (res.data.success) {
                toast.success("Order placed! Awaiting confirmation.")
                clearCart()
                router.push(`/orders`)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Order failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null

    return (
        <div className='max-w-6xl mx-auto px-4 py-10 min-h-screen'>
            <div className='flex flex-col lg:flex-row gap-10'>
                
                <div className='flex-1'>
                    <h1 className='text-3xl font-bold mb-6 text-gray-900'>Checkout</h1>
                    
                    <form id="checkout-form" onSubmit={handleSubmit} className='space-y-6'>
                        <div className='bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5'>
                            <div className='flex items-center gap-3 text-lg font-semibold text-gray-800 border-b pb-3'>
                                <HiOutlineMapPin className='text-blue-600' />
                                <h2>Delivery Details</h2>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-600'>Full Delivery Address</label>
                                <textarea 
                                    required 
                                    name='address' 
                                    value={formData.address} 
                                    onChange={handleInput} 
                                    rows='3' 
                                    placeholder='House, Road, Area, District...' 
                                    className='w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-black/5 transition-all'
                                ></textarea>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-600'>Alternative Phone (Optional)</label>
                                <div className='relative'>
                                    <HiOutlinePhone className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                                    <input 
                                        name='alt_phone' 
                                        value={formData.alt_phone} 
                                        onChange={handleInput} 
                                        type="tel" 
                                        placeholder='01XXXXXXXXX' 
                                        className='w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-black/5 transition-all' 
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-600'>Order Note</label>
                                <input 
                                    name='notes' 
                                    value={formData.notes} 
                                    onChange={handleInput} 
                                    type="text" 
                                    placeholder='Any special instructions?' 
                                    className='w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-black/5 transition-all' 
                                />
                            </div>
                        </div>

                        <div className='p-6 rounded-3xl bg-blue-50 border border-blue-100'>
                            <p className='text-sm text-blue-800'>
                                <strong>Note:</strong> Since we operate multiple branches, your items may be consolidated. 
                                Our staff will call to confirm before delivery.
                            </p>
                        </div>
                    </form>
                </div>

                {/* RIGHT: Order Summary */}
                <div className='w-full lg:w-100'>
                    <div className='bg-white p-6 rounded-3xl border border-gray-100 shadow-xl sticky top-24'>
                        <h2 className='text-xl font-bold mb-6 flex items-center gap-2'>
                            <HiOutlineShoppingBag /> Summary
                        </h2>

                        <div className='space-y-4 mb-6 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar'>
                            {cart.items.map((item) => (
                                <div key={item.product_id} className='flex items-center gap-4'>
                                    <div className='relative w-16 h-16 rounded-2xl bg-gray-50 shrink-0 overflow-hidden border border-gray-100'>
                                        <Image src={item.image} alt={item.name} fill className='object-cover' />
                                    </div>
                                    <div className='flex-1'>
                                        <h3 className='text-sm font-semibold line-clamp-1'>{item.name}</h3>
                                        <p className='text-xs text-gray-500'>Qty: {item.quantity} × ৳{item.sale_price - item.discount_price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='border-t border-dashed pt-4 space-y-3'>
                            <div className='flex justify-between text-gray-600'>
                                <span>Subtotal</span>
                                <span>৳{subtotal}</span>
                            </div>
                            <div className='flex justify-between text-gray-600'>
                                <span>Delivery Fee</span>
                                <span>৳{deliveryFee}</span>
                            </div>
                            <div className='flex justify-between text-2xl font-black text-gray-900 pt-3 border-t border-gray-100 mt-3'>
                                <span>Total</span>
                                <span>৳{grandTotal}</span>
                            </div>
                        </div>

                        <button 
                            form="checkout-form"
                            disabled={loading || cart.items.length === 0}
                            type='submit'
                            className='w-full mt-8 bg-black text-white py-5 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {loading ? 'Processing...' : 'Confirm Order (COD)'}
                        </button>
                        
                        <p className='text-center text-xs text-gray-400 mt-4 italic'>
                            Payment is collected at the time of delivery.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CheckOutPage