'use client'
import React, { useContext, useState } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link'
import { MdHome, MdInventory, MdSuperscript } from 'react-icons/md'
import { IoBag, IoCartOutline } from 'react-icons/io5'
import { RiAlignItemLeftLine, RiCustomerServiceLine, RiCustomSize, RiHome2Line, RiSettings3Line } from 'react-icons/ri'
import { TbBrandBandcamp, TbCategory, TbGitBranch } from "react-icons/tb";
import { CircleUser } from 'lucide-react'

const PanelSidebar = () => {
  const { panelSidebar } = useContext(Context)
  const [option, setOption] = useState('')

  
  return (
    <div className={`w-50 bg-white shadow-xl overflow-y-scroll pb-8 text-lg h-screen fixed z-50 top-14 left-0 flex flex-col gap-4 p-2 ${panelSidebar?'translate-x-0':'-translate-x-full'} ease-in-out transform duration-500`}>
      <Link className='w-full hover:text-white hover:bg-orange-300 px-2 flex flex-row items-center gap-4' href={'/panel'} onClick={() => setOption('')}><MdHome/> Home</Link>
      <div className='w-full flex flex-col gap-2 px-2'>
        <button onClick={() => setOption('sales')} className='cursor-pointer w-full text-left hover:bg-orange-300 hover:text-white flex flex-row items-center gap-4'> <IoCartOutline/> Sales</button>
        {option === 'sales' && <div className='w-full border-l-2 flex flex-col gap-2 px-2'>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/pos'}>POS</Link>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/sales-list'}>Sales List</Link>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/sales-payments'}>Payments</Link>
        </div>
        }
      </div>

      <div className='w-full flex flex-col gap-2 px-2'>
        <button onClick={() => setOption('purchase')} className='cursor-pointer w-full text-left hover:bg-orange-300 hover:text-white flex flex-row items-center gap-4'><IoBag/> Purchase</button>
        {option === 'purchase' && <div className='w-full border-l-2 flex flex-col gap-2 px-2'>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/purchase'}>Purchase</Link>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/purchase-list'}>Purchase List</Link>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/purchase-payments'}>Payments</Link>
        </div>
        }
      </div>

      <div className='w-full flex flex-col gap-2 px-2'>
        <button onClick={() => setOption('products')} className='cursor-pointer w-full text-left hover:bg-orange-300 hover:text-white flex flex-row items-center gap-4'><RiAlignItemLeftLine/> Products</button>
        {option === 'products' && <div className='w-full border-l-2 flex flex-col gap-2 px-2'>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/new-product'}>New Products</Link>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/product-list'}>Product List</Link>
        </div>
        }
      </div>

      <div className='w-full flex flex-col gap-2 px-2'>
        <button onClick={() => setOption('brands')} className='cursor-pointer w-full text-left hover:bg-orange-300 hover:text-white flex flex-row items-center gap-4'> <TbBrandBandcamp/> Brands</button>
        {option === 'brands' && <div className='w-full border-l-2 flex flex-col gap-2 px-2'>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/new-brand'}>New Brand</Link>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/brand-list'}>Brand List</Link>
        </div>
        }
      </div>

      <div className='w-full flex flex-col gap-2 px-2'>
        <button onClick={() => setOption('category')} className='cursor-pointer w-full text-left hover:bg-orange-300 hover:text-white flex flex-row items-center gap-4'><TbCategory/> Category</button>
        {option === 'category' && <div className='w-full border-l-2 flex flex-col gap-2 px-2'>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/new-category'}>New Category</Link>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/category-list'}>Category List</Link>
        </div>
        }
      </div>

      <div className='w-full flex flex-col gap-2 px-2'>
        <button onClick={() => setOption('supplier')} className='cursor-pointer w-full text-left hover:bg-orange-300 hover:text-white flex flex-row items-center gap-4'><MdSuperscript/> Supplier</button>
        {option === 'supplier' && <div className='w-full border-l-2 flex flex-col gap-2 px-2'>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/new-supplier'}>New Supplier</Link>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/supplier-list'}>Supplier List</Link>
        </div>
        }
      </div>

      <div className='w-full flex flex-col gap-2 px-2'>
        <button onClick={() => setOption('branch')} className='cursor-pointer w-full text-left hover:bg-orange-300 hover:text-white flex flex-row items-center gap-4'><TbGitBranch/> Branch</button>
        {option === 'branch' && <div className='w-full border-l-2 flex flex-col gap-2 px-2'>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/new-branch'}>New Branch</Link>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/branch-list'}>Branch List</Link>
        </div>
        }
      </div>

      <div className='w-full flex flex-col gap-2 px-2'>
        <button onClick={() => setOption('staff')} className='cursor-pointer w-full text-left hover:bg-orange-300 hover:text-white flex flex-row items-center gap-4'><CircleUser/> Staff</button>
        {option === 'staff' && <div className='w-full border-l-2 flex flex-col gap-2 px-2'>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/new-staff'}>New Staff</Link>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/staff-list'}>Staff List</Link>
        </div>
        }
      </div>

      <div className='w-full flex flex-col gap-2 px-2'>
        <button onClick={() => setOption('inventory')} className='cursor-pointer w-full text-left hover:bg-orange-300 hover:text-white flex flex-row items-center gap-4'><MdInventory/> Inventory</button>
        {option === 'inventory' && <div className='w-full border-l-2 flex flex-col gap-2 px-2'>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/new-stock'}>Add Stock</Link>
          <Link className='w-full hover:text-white hover:bg-orange-300 px-2' href={'/panel/stock-report'}>Stock Report</Link>
        </div>
        }
      </div>

      <Link className='w-full hover:text-white hover:bg-orange-300 px-2 flex flex-row items-center gap-4' href={'/panel/customers'} onClick={() => setOption('')}><RiCustomSize/> Customers</Link>
      <Link className='w-full hover:text-white hover:bg-orange-300 px-2 flex flex-row items-center gap-4' href={'/panel/supports'} onClick={() => setOption('')}> <RiCustomerServiceLine/>Supports</Link>
      <Link className='w-full hover:text-white hover:bg-orange-300 px-2 flex flex-row items-center gap-4' href={'/panel/settings'} onClick={() => setOption('')}> <RiSettings3Line/>Settings</Link>
      <Link className='w-full hover:text-white hover:bg-orange-300 px-2 flex flex-row items-center gap-4' href={'/'} onClick={() => setOption('')}> <RiHome2Line/>Website</Link>

    </div>
  )
}

export default PanelSidebar
