'use client'
import UpdateProductForm from '@/components/forms/UpdateProductForm'
import { Context } from '@/components/helper/Context'
import axios from 'axios'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { MdCancel, MdDeleteOutline, MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'

const ProductsPage = () => {

  const { categories } = useContext(Context)
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [category, setCategory] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/product', {
          params: {
            category_id: category,
            page: page
          }
        })
        setProducts(res.data.payload)
        setTotalPage(res.data.totalPage)
      } catch (error) {
        console.log(error)
        setProducts([])
        setTotalPage(1)
      }
    }
    fetchProducts()
  }, [category, page])

  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
    setPage(1)
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure to delete?')
    if (!confirm) return
    try {
      const res = await axios.delete('/api/product', { data: { id }, withCredentials: true })
      toast.success(res.data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete product')

    }
  }

  const [editBox, setEditBox] = useState(null)

  return (
    <div className='w-full flex flex-col items-center gap-4 p-1 min-h-screen sm:p-4'>
      <select name="category" id="category" onChange={handleCategoryChange} value={category} className='w-full bg-white border border-black/20 cursor-pointer text-black outline-none p-1 text-center'>
        <option value="">select</option>
        {
          categories.length > 0 && categories.map((cat) => (
            <option value={cat.category_id} key={cat.category_id} className='text-black'>{cat.name}</option>
          ))
        }
      </select>

      {
        products.length > 0 ? (
          <div className='w-full flex flex-col items-center gap-6'>
            <div className='w-full grid grid-cols-6 gap-2'>
              <p className='col-span-1'>Image</p>
              <p className='col-span-3'>Name</p>
              <p className='col-span-1'>Barcode</p>
              <p className='col-span-1 flex items-center justify-center'>Action</p>
            </div>
            {
              products.map((product) => (
                <div key={product.product_id} className='w-full grid grid-cols-6 gap-2'>
                  <div className='col-span-1'>
                    <Image src={product?.image} alt='product image' width={40} height={40} />
                  </div>
                  <p className='col-span-3'>{product?.name}</p>
                  <p className='col-span-1'>{product?.barcode}</p>
                  <div className='col-span-1 flex flex-row items-center justify-center gap-4 text-xl'>
                    <button className='cursor-pointer' onClick={() => handleDelete(product.product_id)}><MdDeleteOutline /></button>
                    <button className='cursor-pointer' onClick={() => setEditBox(product)} ><MdEdit /></button>
                  </div>
                </div>
              ))
            }

            <div className='w-full flex flex-row items-center justify-center gap-4'>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className='px-4 cursor-pointer bg-orange-400 text-white rounded-2xl p-1 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Prev
              </button>

              <span className="text-sm font-bold">Page {page} of {totalPage}</span>

              <button
                disabled={page === totalPage}
                onClick={() => setPage(page + 1)}
                className='px-4 cursor-pointer bg-orange-400 text-white rounded-2xl p-1 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p>No data found</p>
        )
      }
      {
        editBox !== null && <div className='flex items-center justify-center fixed inset-0 z-40 backdrop-blur-2 bg-black/40'>
          <div className='relative bg-white p-4 rounded-2xl'>
            <button className='top-2 right-2 absolute text-xl cursor-pointer' onClick={() => setEditBox(null)}><MdCancel /></button>
            <UpdateProductForm product={editBox} />
          </div>
        </div>
      }
    </div>
  )
}

export default ProductsPage