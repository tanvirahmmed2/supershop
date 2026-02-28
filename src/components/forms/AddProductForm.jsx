'use client'
import React, { useContext, useState } from 'react'
import { Context } from '../helper/Context'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddProductForm = () => {
  const { brands, categories } = useContext(Context)

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
      const res= await axios.post('/api/product', data, {withCredentials:true})
      toast.success(res.data.message)

    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add product')

    }
  }


  return (
    <form onSubmit={handleSubmit} className='w-full flex flex-col items-center gap-3'>

      <div>
        <label htmlFor="name">Name</label>
        <input type="text" name='name' id='name' required onChange={handleChange} value={formData.name} />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea name="description" id="description" required onChange={handleChange} value={formData.description}></textarea>
      </div>

      <div>
        <div>
          <div>
            <label htmlFor="category">Category</label>
            <button type='button'>+</button>
          </div>
          <select name="category_id" required onChange={handleChange} value={formData.category_id} id="category_id">
            <option value="">Select</option>
            {
              categories.length>0 && categories.map((cat)=>(
                <option value={cat.category_id} key={cat.category_id}>{cat.name}</option>
              ))
            }
          </select>
        </div>
        <div>
          <div>
            <label htmlFor="brand">Brand</label>
            <button type='button'>+</button>
          </div>
          <select name="brand_id" required onChange={handleChange} value={formData.brand_id} id="brand_id">
            <option value="">Select</option>
            {
              brands.length>0 && brands.map((brand)=>(
                <option value={brand.brand_id} key={brand.brand_id}>{brand.name}</option>
              ))
            }
          </select>
        </div>
      </div>

      <div>
        <div>
          <label htmlFor="barcode">Barcode</label>
          <input type="text" name='barcode' onChange={handleChange} id='barcode' value={formData.barcode} />
        </div>
        <div>
          <label htmlFor="purchase_price">Purchase Price</label>
          <input type="text" name="purchase_price" id="purchase_price" required onChange={handleChange} value={formData.purchase_price} />
        </div>
      </div>
      
      <div>
        <div>
          <label htmlFor="sale_price">Sale Price</label>
          <input type="text" name='sale_price' id='sale_price' required onChange={handleChange} value={formData.sale_price} />
        </div>
        <div>
          <label htmlFor="discount_price">Discount Price</label>
          <input type="text" name='discount_price' id='discount_price' onChange={handleChange} value={formData.discount_price} />
        </div>
      </div>
    </form>
  )
}

export default AddProductForm
