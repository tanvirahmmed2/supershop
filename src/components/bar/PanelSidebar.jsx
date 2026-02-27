'use client'
import React, { useContext, useState } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link'

const PanelSidebar = () => {
  const { panelSidebar } = useContext(Context)
  const [option, setOption] = useState('')

  
  return (
    <div className={`w-50 bg-white shadow-xl text-lg h-screen fixed top-14 left-0 flex flex-col gap-1 p-2 ${panelSidebar?'translate-x-0':'-translate-x-full'} ease-in-out transform duration-500`}>
      <Link href={'/panel'} onClick={() => setOption('')}>Home</Link>
      <div className='w-full flex flex-col gap-1'>
        <button onClick={() => setOption('sales')} className='cursor-pointer w-full text-left'>Sales</button>
        {option === 'sales' && <div className='w-full border-l-2 flex flex-col gap-1 px-2'>
          <Link href={'/panel/pos'}>POS</Link>
          <Link href={'/panel/sales-list'}>Sales List</Link>
          <Link href={'/panel/sales-payments'}>Payments</Link>
        </div>
        }
      </div>

      <div className='w-full flex flex-col gap-1'>
        <button onClick={() => setOption('purchase')} className='cursor-pointer w-full text-left'>Purchase</button>
        {option === 'purchase' && <div className='w-full border-l-2 flex flex-col gap-1 px-2'>
          <Link href={'/panel/purchase'}>Purchase</Link>
          <Link href={'/panel/purchase-list'}>Purchase List</Link>
          <Link href={'/panel/purchase-payments'}>Payments</Link>
        </div>
        }
      </div>

      <div className='w-full flex flex-col gap-1'>
        <button onClick={() => setOption('products')} className='cursor-pointer w-full text-left'>Products</button>
        {option === 'products' && <div className='w-full border-l-2 flex flex-col gap-1 px-2'>
          <Link href={'/panel/new-product'}>New Products</Link>
          <Link href={'/panel/product-list'}>Product List</Link>
        </div>
        }
      </div>

      <div className='w-full flex flex-col gap-1'>
        <button onClick={() => setOption('brands')} className='cursor-pointer w-full text-left'>Brands</button>
        {option === 'brands' && <div className='w-full border-l-2 flex flex-col gap-1 px-2'>
          <Link href={'/panel/new-brand'}>New Brand</Link>
          <Link href={'/panel/brand-list'}>Brand List</Link>
        </div>
        }
      </div>

      <div className='w-full flex flex-col gap-1'>
        <button onClick={() => setOption('category')} className='cursor-pointer w-full text-left'>Category</button>
        {option === 'category' && <div className='w-full border-l-2 flex flex-col gap-1 px-2'>
          <Link href={'/panel/new-category'}>New Category</Link>
          <Link href={'/panel/category-list'}>Category List</Link>
        </div>
        }
      </div>

      <div className='w-full flex flex-col gap-1'>
        <button onClick={() => setOption('supplier')} className='cursor-pointer w-full text-left'>Supplier</button>
        {option === 'supplier' && <div className='w-full border-l-2 flex flex-col gap-1 px-2'>
          <Link href={'/panel/new-supplier'}>New Supplier</Link>
          <Link href={'/panel/supplier-list'}>Supplier List</Link>
        </div>
        }
      </div>

      <div className='w-full flex flex-col gap-1'>
        <button onClick={() => setOption('branch')} className='cursor-pointer w-full text-left'>Branch</button>
        {option === 'branch' && <div className='w-full border-l-2 flex flex-col gap-1 px-2'>
          <Link href={'/panel/new-branch'}>New Branch</Link>
          <Link href={'/panel/branch-list'}>Branch List</Link>
        </div>
        }
      </div>

      <div className='w-full flex flex-col gap-1'>
        <button onClick={() => setOption('staff')} className='cursor-pointer w-full text-left'>Staff</button>
        {option === 'staff' && <div className='w-full border-l-2 flex flex-col gap-1 px-2'>
          <Link href={'/panel/new-staff'}>New Staff</Link>
          <Link href={'/panel/staff-list'}>Staff List</Link>
        </div>
        }
      </div>

      <div className='w-full flex flex-col gap-1'>
        <button onClick={() => setOption('inventory')} className='cursor-pointer w-full text-left'>Inventory</button>
        {option === 'inventory' && <div className='w-full border-l-2 flex flex-col gap-1 px-2'>
          <Link href={'/panel/new-stock'}>Add Stock</Link>
          <Link href={'/panel/stock-report'}>Stock Report</Link>
        </div>
        }
      </div>

      <Link href={'/panel/customers'} onClick={() => setOption('')}>Customers</Link>
      <Link href={'/panel/supports'} onClick={() => setOption('')}>Supports</Link>

    </div>
  )
}

export default PanelSidebar
