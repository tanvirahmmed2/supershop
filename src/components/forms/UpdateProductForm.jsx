'use client'
import React, { useContext, useState, useEffect } from 'react'
import { Context } from '../helper/Context'
import { toast } from 'react-toastify'
import axios from 'axios'
import Image from 'next/image'

const UpdateProductForm = ({ product }) => {
  const { brands, categories, setCategoryBox, setBrandBox, fetchProducts } = useContext(Context)

  const [formData, setFormData] = useState({
    product_id: product?.product_id || '',
    name: product?.name || '',
    description: product?.description || '',
    barcode: product?.barcode || '',
    purchase_price: product?.purchase_price || "",
    sale_price: product?.sale_price || '',
    discount_price: product?.discount_price || "",
    retail_price: product?.retail_price || "",
    wholesale_price: product?.wholesale_price || "",
    dealer_price: product?.dealer_price || '',
    features: Array.isArray(product?.features) ? product.features.join(', ') : '',
    brand_id: product?.brand_id || "",
    category_id: product?.category_id || '',
    image: null
  })

  const [preview, setPreview] = useState(product?.image || null)

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === "file") {
      const file = files[0];
      if (!file) return;
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const loadId = toast.loading("Updating product...")
    try {
      const data = new FormData()
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      })

      const res = await axios.patch('/api/product', data, { withCredentials: true })
      
      if (res.data.success) {
        toast.update(loadId, { render: res.data.message, type: "success", isLoading: false, autoClose: 3000 });
        if (fetchProducts) fetchProducts();
        window.location.reload();
      }
    } catch (error) {
      toast.update(loadId, { render: error?.response?.data?.message || 'Update failed', type: "error", isLoading: false, autoClose: 3000 });
    }
  }

  return (
    <form onSubmit={handleSubmit} className='w-full flex flex-col items-center gap-3'>
     
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="name">Name</label>
        <input type="text" name='name' id='name' required onChange={handleChange} value={formData.name} className='w-full px-3 p-1 border border-black/20 outline-none' />
      </div>

      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="description">Description</label>
        <textarea name="description" id="description" required onChange={handleChange} value={formData.description} className='w-full px-3 p-1 border border-black/20 outline-none'></textarea>
      </div>

      {/* Selects */}
      <div className='w-full flex flex-col md:flex-row gap-3'>
        <div className='w-full flex flex-col gap-1'>
          <div className='w-full flex flex-row items-center justify-between'>
            <label htmlFor="category">Category</label>
            <button type='button' className='bg-black text-white px-2 text-xl' onClick={() => setCategoryBox(true)}>+</button>
          </div>
          <select name="category_id" required onChange={handleChange} value={formData.category_id} className='w-full px-3 p-1 border border-black/20 outline-none'>
            <option value="">Select</option>
            {categories?.map(cat => <option value={cat.category_id} key={cat.category_id}>{cat.name}</option>)}
          </select>
        </div>
        <div className='w-full flex flex-col gap-1'>
          <div className='w-full flex flex-row items-center justify-between'>
            <label htmlFor="brand">Brand</label>
            <button type='button' className='bg-black text-white px-2 text-xl' onClick={() => setBrandBox(true)}>+</button>
          </div>
          <select name="brand_id" onChange={handleChange} value={formData.brand_id} className='w-full px-3 p-1 border border-black/20 outline-none'>
            <option value="">Select</option>
            {brands?.map(b => <option value={b.brand_id} key={b.brand_id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      <div className='w-full flex flex-col md:flex-row gap-3'>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="barcode">Barcode</label>
          <input type="text" name='barcode' onChange={handleChange} value={formData.barcode} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="purchase_price">Purchase Price</label>
          <input type="number" step="any" name="purchase_price" required onChange={handleChange} value={formData.purchase_price} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
      </div>

      <div className='w-full flex flex-col md:flex-row gap-3'>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="sale_price">Sale Price</label>
          <input type="number" step="any" name='sale_price' required onChange={handleChange} value={formData.sale_price} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="discount_price">Discount Price</label>
          <input type="number" step="any" name='discount_price' onChange={handleChange} value={formData.discount_price} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
      </div>

      <div className='w-full flex flex-col md:flex-row gap-3'>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="retail_price">Retail Price</label>
          <input type="number" step="any" name='retail_price' onChange={handleChange} value={formData.retail_price} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="dealer_price">Dealer Price</label>
          <input type="number" step="any" name='dealer_price' onChange={handleChange} value={formData.dealer_price} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="wholesale_price">Wholesale Price</label>
          <input type="number" step="any" name='wholesale_price' onChange={handleChange} value={formData.wholesale_price} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
      </div>

      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="features">Features (Comma separated)</label>
        <input type="text" name='features' onChange={handleChange} value={formData.features} className='w-full px-3 p-1 border border-black/20 outline-none' />
      </div>

      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="image">Image (Leave blank to keep existing)</label>
        <input type="file" accept='image/*' name='image' onChange={handleChange} className='w-full px-3 p-1 border border-black/20 outline-none' />
      </div>

      {preview && <Image src={preview} alt='preview' width={150} height={150} className='object-contain border border-gray-100 p-1' />}
      
      <button type='submit' className='w-full text-center text-white bg-black p-2 hover:bg-gray-800 cursor-pointer font-bold'>Update Product</button>
    </form>
  )
}

export default UpdateProductForm