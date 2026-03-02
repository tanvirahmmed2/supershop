import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const ProductsPage =  async() => {
  const res= await fetch(`${BASE_URL}/api/product`,{
    method:'GET'
  })
  return (
    <div>
      
    </div>
  )
}

export default ProductsPage
