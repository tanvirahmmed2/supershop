
'use client'
import { Context } from '@/components/helper/Context'
import React, { useContext, useEffect, useState } from 'react'

const ProductsPage =  () => {

  const {categories}= useContext(Context)
  const [products, setProducts]= useState([])
  const [page, setPage]=useState(1)
  const [totalPage, setTotalPage]= useState(1)
  const [category,setCategory]= useState('')
 
  useEffect(()=>{
    const fetchProducts=async()=>{
      try {
        
      } catch (error) {
        
      }
    }
    fetchProducts()
  },[])

  return (
    <div>

    </div>
  )
}

export default ProductsPage
