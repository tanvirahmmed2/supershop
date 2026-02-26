'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'

const PanelSidebar = () => {
  const {panelSidebar, setPanelSidebar}= useContext(Context)
  return (
    <div className='w-50 bg-red-400 h-screen fixed top-14 left-0'>
      
    </div>
  )
}

export default PanelSidebar
