'use client'
import React, { useContext, useState } from 'react'
import { Context } from '../helper/Context'

const AddProductForm = () => {
  const {brands, categories}= useContext(Context)

  const [formData, setFormData] = useState({
    name:'',
    description:'',
    barcode:'',
    purchase_price:"",
    sale_price:'',
    discount_price:"",
    retail_price:"",
    wholesale_price:"",
    dealer_price:'',
    features:'',
    brand_id:"",
    category_id:'',
    image:null
  })

  

  return (
    <div>

    </div>
  )
}

export default AddProductForm
