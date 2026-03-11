'use client'
import React, { useContext, useState } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link'
import { MdHome, MdSuperscript } from 'react-icons/md'
import { IoBag, IoCartOutline } from 'react-icons/io5'
import { RiAlignItemLeftLine, RiCustomerServiceLine, RiCustomSize, RiHome2Line, RiSettings3Line } from 'react-icons/ri'
import { TbBrandBandcamp, TbCategory, TbGitBranch } from "react-icons/tb";
import { CircleUser, ChevronRight } from 'lucide-react'

const NavItem = ({ id, label, icon: Icon, children, option, toggleOption }) => {
  const linkStyle = "group w-full px-4 py-2.5 rounded-xl flex flex-row items-center gap-4 transition-all duration-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 font-medium"
  const iconStyle = "text-xl group-hover:scale-110 transition-transform duration-200"

  return (
    <div className='w-full flex flex-col'>
      <button
        onClick={() => toggleOption(id)}
        className={`${linkStyle} justify-between cursor-pointer ${option === id ? 'bg-orange-50 text-orange-600' : ''}`}
      >
        <div className='flex items-center gap-4'><Icon className={iconStyle} /> {label}</div>
        <ChevronRight size={16} className={`transition-transform duration-300 ${option === id ? 'rotate-90' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${option === id ? 'max-h-60 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
        <div className='ml-9 border-l-2 border-orange-100 flex flex-col gap-1 pl-2'>
          {children}
        </div>
      </div>
    </div>
  )
}

const PanelSidebar = () => {
  const { panelSidebar, staff } = useContext(Context)
  const [option, setOption] = useState('')
  const toggleOption = (name) => {
    setOption(option === name ? '' : name)
  }

  const linkStyle = "group w-full px-4 py-2.5 rounded-xl flex flex-row items-center gap-4 transition-all duration-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 font-medium"
  const subLinkStyle = "w-full py-2 px-4 rounded-lg hover:bg-orange-100 hover:text-orange-700 transition-colors text-sm font-medium text-slate-500"
  const iconStyle = "text-xl group-hover:scale-110 transition-transform duration-200"

  return (
    <div className={`w-64 bg-white border-r border-slate-100 shadow-2xl overflow-y-auto pb-20 h-screen fixed z-50 top-14 left-0 flex flex-col gap-1 p-3 transition-transform duration-500 ease-in-out ${panelSidebar ? 'translate-x-0' : '-translate-x-full'}`}>

      <Link className={linkStyle} href={'/panel'} onClick={() => setOption('')}>
        <MdHome className={iconStyle} /> <span>Home</span>
      </Link>

      {
        staff?.role === 'sales' && <NavItem id="sales" label="Sales" icon={IoCartOutline} option={option} toggleOption={toggleOption}>
          <Link className={subLinkStyle} href={'/panel/sales'}>POS</Link>
          <Link className={subLinkStyle} href={'/panel/sales-list'}>Sales List</Link>
          <Link className={subLinkStyle} href={'/panel/sales-list/payments'}>Payments</Link>
        </NavItem>
      }

      {
        staff?.role === 'inventory_manager' && <NavItem id="purchase" label="Purchase" icon={IoBag} option={option} toggleOption={toggleOption}>
          <Link className={subLinkStyle} href={'/panel/purchase'}>Purchase</Link>
          <Link className={subLinkStyle} href={'/panel/purchase-list'}>Purchase List</Link>
          <Link className={subLinkStyle} href={'/panel/purchase-list/payments'}>Payments</Link>
        </NavItem>
      }

      {
        staff?.role === 'branch_manager' && <NavItem id="report" label="Report" icon={IoBag} option={option} toggleOption={toggleOption}>
          <Link className={subLinkStyle} href={'/panel/stock-report'}>Stock</Link>
          <Link className={subLinkStyle} href={'/panel/sales-report'}>Sales</Link>
          <Link className={subLinkStyle} href={'/panel/purchase-report'}>Purchases</Link>
        </NavItem>
      }

      {
        staff?.role === 'manager' && <div className='w-full flex flex-col gap-1'>
          <NavItem id="products" label="Products" icon={RiAlignItemLeftLine} option={option} toggleOption={toggleOption}>
            <Link className={subLinkStyle} href={'/panel/new-product'}>New Products</Link>
            <Link className={subLinkStyle} href={'/panel/product-list'}>Product List</Link>
          </NavItem>

          <NavItem id="brands" label="Brands" icon={TbBrandBandcamp} option={option} toggleOption={toggleOption}>
            <Link className={subLinkStyle} href={'/panel/new-brand'}>New Brand</Link>
            <Link className={subLinkStyle} href={'/panel/brand-list'}>Brand List</Link>
          </NavItem>

          <NavItem id="category" label="Category" icon={TbCategory} option={option} toggleOption={toggleOption}>
            <Link className={subLinkStyle} href={'/panel/new-category'}>New Category</Link>
            <Link className={subLinkStyle} href={'/panel/category-list'}>Category List</Link>
          </NavItem>

          <NavItem id="supplier" label="Supplier" icon={MdSuperscript} option={option} toggleOption={toggleOption}>
            <Link className={subLinkStyle} href={'/panel/new-supplier'}>New Supplier</Link>
            <Link className={subLinkStyle} href={'/panel/supplier-list'}>Supplier List</Link>
          </NavItem>

          <NavItem id="branch" label="Branch" icon={TbGitBranch} option={option} toggleOption={toggleOption}>
            <Link className={subLinkStyle} href={'/panel/new-branch'}>New Branch</Link>
            <Link className={subLinkStyle} href={'/panel/branch-list'}>Branch List</Link>
          </NavItem>

          <NavItem id="staff" label="Staff" icon={CircleUser} option={option} toggleOption={toggleOption}>
            <Link className={subLinkStyle} href={'/panel/new-staff'}>New Staff</Link>
            <Link className={subLinkStyle} href={'/panel/staff-list'}>Staff List</Link>
          </NavItem>
          <NavItem id="main-report" label="Report" icon={CircleUser} option={option} toggleOption={toggleOption}>
            <Link className={subLinkStyle} href={'/panel/total-stock'}>Total Stock</Link>
            <Link className={subLinkStyle} href={'/panel/report/total-sales'}>Total Sales Report</Link>
            <Link className={subLinkStyle} href={'/panel/report/total-purchase'}>Total Purchase Report</Link>
            <Link className={subLinkStyle} href={'/panel/report'}>Total Report</Link>
          </NavItem>

          <div className='my-2 border-t border-slate-100 mx-4'></div>

          <Link className={linkStyle} href={'/panel/customers'} onClick={() => setOption('')}><RiCustomSize className={iconStyle} /> Customers</Link>
          <Link className={linkStyle} href={'/panel/supports'} onClick={() => setOption('')}> <RiCustomerServiceLine className={iconStyle} />Supports</Link>
          <Link className={linkStyle} href={'/panel/settings'} onClick={() => setOption('')}> <RiSettings3Line className={iconStyle} />Settings</Link>

        </div>
      }


      <div className='mt-auto p-4'>
        <Link className={linkStyle} href={'/'} onClick={() => setOption('')}>
        <MdHome className={iconStyle} /> <span>Exit to Website</span>
      </Link>
      </div>
    </div>
  )
}

export default PanelSidebar