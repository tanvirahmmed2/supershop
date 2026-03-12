'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link'
import Image from 'next/image'
import { MdDeleteOutline, MdAdd, MdRemove } from 'react-icons/md'
import { HiOutlineShoppingBag } from 'react-icons/hi'

const Cart = () => {
    const { cart, addToCart, removeFromCart, clearCart, decreaseCartQuantity } = useContext(Context)

    const subtotal = cart.items.reduce((acc, item) => acc + (item.sale_price - item.discount_price) * item.quantity, 0)

    return (
        <div className='max-w-4xl mx-auto w-full p-4'>
            <div className='flex items-center justify-between mb-8 border-b pb-4'>
                <h1 className='text-2xl font-bold flex items-center gap-2'>
                    <HiOutlineShoppingBag /> Shopping Cart
                </h1>
                {cart.items.length > 0 && (
                    <button 
                        onClick={() => clearCart()}
                        className='text-sm text-red-500 hover:underline cursor-pointer font-medium'
                    >
                        Clear Cart
                    </button>
                )}
            </div>

            {cart.items.length > 0 ? (
                <div className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-4'>
                        {cart.items.map((item) => {
                            const unitPrice = item.sale_price - item.discount_price
                            return (
                                <div key={item.product_id} className='flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100'>
                                    <div className='relative w-24 h-24 shrink-0 bg-gray-50 rounded-xl overflow-hidden border'>
                                        <Image src={item?.image} alt={item.name} fill className='object-cover' />
                                    </div>

                                    <div className='flex-1 w-full'>
                                        <div className='flex justify-between items-start'>
                                            <h2 className='font-semibold text-lg text-gray-800 line-clamp-1'>{item?.name}</h2>
                                            <button 
                                                onClick={() => removeFromCart(item.product_id)}
                                                className='text-gray-400 hover:text-red-500 transition-colors p-1'
                                            >
                                                <MdDeleteOutline size={24} />
                                            </button>
                                        </div>
                                        
                                        <div className='flex items-center justify-between mt-4'>
                                            <div className='flex items-center border rounded-xl overflow-hidden'>
                                                <button 
                                                    onClick={() => decreaseCartQuantity(item.product_id)}
                                                    className='p-2 hover:bg-gray-100 transition-colors text-gray-600'
                                                >
                                                    <MdRemove />
                                                </button>
                                                <span className='px-4 font-medium text-gray-800'>{item.quantity}</span>
                                                <button 
                                                    onClick={() => addToCart(item)}
                                                    className='p-2 hover:bg-gray-100 transition-colors text-gray-600'
                                                >
                                                    <MdAdd />
                                                </button>
                                            </div>

                                            <div className='text-right'>
                                                <p className='text-xs text-gray-400 line-through'>৳{item.sale_price * item.quantity}</p>
                                                <p className='font-bold text-lg text-gray-900'>৳{unitPrice * item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className='bg-gray-50 p-6 rounded-3xl mt-4 border border-gray-100'>
                        <div className='flex justify-between items-center mb-6'>
                            <span className='text-gray-600 font-medium'>Subtotal</span>
                            <span className='text-2xl font-bold text-gray-900'>৳{subtotal.toFixed(2)}</span>
                        </div>
                        <Link 
                            href='/checkout'
                            className='w-full block text-center bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-900 transition-all shadow-lg active:scale-[0.98]'
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            ) : (
                <div className='w-full py-20 flex flex-col items-center justify-center gap-6 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50'>
                    <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400'>
                        <HiOutlineShoppingBag size={40} />
                    </div>
                    <div className='text-center'>
                        <h3 className='text-xl font-bold text-gray-800'>Your cart is empty</h3>
                        <p className='text-gray-500 mt-1'>Looks like you haven't added anything yet.</p>
                    </div>
                    <Link 
                        href='/products' 
                        className='bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all'
                    >
                        Continue Shopping
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Cart