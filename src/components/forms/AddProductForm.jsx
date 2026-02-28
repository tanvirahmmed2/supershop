'use client'
import React, { useContext, useState } from 'react'
import { Context } from '../helper/Context'
import { toast } from 'react-toastify'
import axios from 'axios'
import Image from 'next/image'

const AddProductForm = () => {
  const { brands, categories, setCategoryBox, setBrandBox, } = useContext(Context)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    barcode: '',
    purchase_price: "",
    sale_price: '',
    discount_price: "",
    retail_price: "",
    wholesale_price: "",
    dealer_price: '',
    features: '',
    brand_id: "",
    category_id: '',
    image: null
  })

  const [preview, setPreview] = useState(null)


  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === "file") {
      const file = files[0];

      if (!file) return;

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      const newPreview = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      setPreview(newPreview);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      })
      const res = await axios.post('/api/product', data, { withCredentials: true })
      toast.success(res.data.message)
      setFormData({
        name: '',
        description: '',
        barcode: '',
        purchase_price: "",
        sale_price: '',
        discount_price: "",
        retail_price: "",
        wholesale_price: "",
        dealer_price: '',
        features: '',
        brand_id: "",
        category_id: '',
        image: null
      })

    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add product')

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

      <div className='w-full flex flex-col md:flex-row gap-3'>
        <div className='w-full flex flex-col gap-1'>
          <div className='w-full flex flex-row items-center justify-between'>
            <label htmlFor="category">Category</label>
            <button type='button' className='bg-black text-white px-2 text-xl cursor-pointer' onClick={() => setCategoryBox(true)}>+</button>
          </div>
          <select name="category_id" required onChange={handleChange} value={formData.category_id} id="category_id" className='w-full px-3 p-1 border border-black/20 outline-none'>
            <option value="">Select</option>
            {
              categories.length > 0 && categories.map((cat) => (
                <option value={cat.category_id} key={cat.category_id}>{cat.name}</option>
              ))
            }
          </select>
        </div>
        <div className='w-full flex flex-col gap-1'>
          <div className='w-full flex flex-row items-center justify-between'>
            <label htmlFor="brand">Brand</label>
            <button type='button' className='bg-black text-white px-2 text-xl cursor-pointer' onClick={() => setBrandBox(true)}>+</button>
          </div>
          <select name="brand_id" required onChange={handleChange} value={formData.brand_id} id="brand_id" className='w-full px-3 p-1 border border-black/20 outline-none'>
            <option value="">Select</option>
            {
              brands.length > 0 && brands.map((brand) => (
                <option value={brand.brand_id} key={brand.brand_id}>{brand.name}</option>
              ))
            }
          </select>
        </div>
      </div>

      <div className='w-full flex flex-col md:flex-row gap-3'>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="barcode">Barcode</label>
          <input type="text" name='barcode' onChange={handleChange} id='barcode' value={formData.barcode} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="purchase_price">Purchase Price</label>
          <input type="number" min={0} step={0.1} name="purchase_price" id="purchase_price" required onChange={handleChange} value={formData.purchase_price} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
      </div>

      <div className='w-full flex flex-col md:flex-row gap-3'>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="sale_price">Sale Price</label>
          <input type="number" min={0} step={0.1} name='sale_price' id='sale_price' required onChange={handleChange} value={formData.sale_price} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="discount_price">Discount Price</label>
          <input type="number" min={0} step={0.1} name='discount_price' id='discount_price' onChange={handleChange} value={formData.discount_price} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
      </div>

      <div className='w-full flex flex-col md:flex-row gap-3'>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="retail_price">Retail Price</label>
          <input type="number" min={0} step={0.1} name='retail_price' id='retail_price' onChange={handleChange} value={formData.retail_price} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="dealer_price">Dealer Price</label>
          <input type="number" min={0} step={0.1} name='dealer_price' id='dealer_price' onChange={handleChange} value={formData.dealer_price} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="wholesale_price">Whole Sale Price</label>
          <input type="number" min={0} step={0.1} name='wholesale_price' id='wholesale_price' onChange={handleChange} value={formData.wholesale_price} className='w-full px-3 p-1 border border-black/20 outline-none' />
        </div>
      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="features">Features</label>
        <input type="text" name='features' id='features' onChange={handleChange} value={formData.features} className='w-full px-3 p-1 border border-black/20 outline-none' />
      </div>

      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="image">Image</label>
        <input type="file" accept='image/*' name='image' id='image' onChange={handleChange} className='w-full px-3 p-1 border border-black/20 outline-none' />
      </div>
      {
        preview && <Image src={preview} alt='preview image' width={200} height={200} />
      }
      <button type='submit' className='w-full text-center text-white bg-black p-1 hover:bg-gray-700 cursor-pointer'>Submit</button>
    </form>
  )
}

export default AddProductForm
