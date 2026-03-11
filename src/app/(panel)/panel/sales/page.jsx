'use client'
import AddSupplierForm from '@/components/forms/AddSupplierForm'
import PurchaseForm from '@/components/forms/PurchaseForm'
import SalesForm from '@/components/forms/SalesForm'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'

const NewPurchase = () => {
  const {addToCart, clearCart}= useContext(Context)
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/product/sale?q=${searchTerm}`, { withCredentials: true })
        setProducts(res.data.payload)
      } catch (error) {
        setProducts([])

      }
    }
    fetchProduct()
  }, [searchTerm])

  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 relative'>
      <div className='w-full flex flex-col items-center gap-4'>
        <SalesForm />
        <button onClick={()=> clearCart()} className='px-4 bg-black text-white cursor-pointer rounded-2xl'>Clear</button>
      </div>
      <div className='w-full flex flex-col items-center gap-4'>
        <div className=' w-full flex flex-row items-center justify-between border-b pb-4'>
          <label htmlFor="Search">Search</label>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='px-3 p-1 border border-black/20 outline-none' placeholder='enter product name' />
        </div>
        <div className='w-full border border-black/20 p-1'>
          {
            searchTerm.length > 0 ? <div className='w-full'>
              {
                products.length > 0 ? <div className='flex flex-col w-full gap-3 '>
                  {
                    products.map((product)=>(
                      <div key={product.product_id} onClick={()=>addToCart(product)} className='w-full flex flex-row items-center gap-4 even:bg-gray-200 cursor-pointer hover:bg-orange-200'>
                        <Image src={product?.image} alt='product iamge' height={40} width={40}/>
                        <p>{product.name.slice(0,80)} ({product.stock})</p>
                      </div>
                    ))
                  }

                </div> :
                  <p>No product found</p>
              }
            </div> : <p>Please search</p>
          }

        </div>

      </div>
   
    </div>
  )
}

export default NewPurchase
