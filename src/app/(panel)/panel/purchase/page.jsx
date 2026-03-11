'use client'
import AddSupplierForm from '@/components/forms/AddSupplierForm'
import PurchaseForm from '@/components/forms/PurchaseForm'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'

const NewPurchase = () => {
  const {addToPurchase, supplierBox, setSupplierBox, fetchSuppliers ,clearPurchase}= useContext(Context)
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/product/purchase?q=${searchTerm}`, { withCredentials: true })
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
        <h1 className='w-full text-center text-2xl font-semibold'>New Purchase</h1>
        <PurchaseForm />
        <button onClick={()=> clearPurchase()} className='px-4 bg-black text-white cursor-pointer rounded-2xl'>Clear</button>
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
                      <div key={product.product_id} onClick={()=>addToPurchase(product)} className='w-full flex flex-row items-center gap-4 even:bg-gray-200 cursor-pointer hover:bg-orange-200'>
                        <Image src={product?.image} alt='product iamge' height={40} width={40}/>
                        <p>{product.name.slice(0,80)}</p>
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
      {
        supplierBox && <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 '>
          <div className='w-auto min-w-80 bg-white p-4 rounded-2xl relative flex flex-col items-center justify-center '>
            <strong>Add Supplier</strong>
            <button type='button' className='bg-black/30 text-white px-4 rounded-2xl cursor-pointer absolute top-2 right-2' onClick={()=>{setSupplierBox(false); fetchSuppliers()}}>close</button>
            <AddSupplierForm/>
          </div>
        </div>
      }
    </div>
  )
}

export default NewPurchase
