import PanelNavbar from '@/components/bar/PanelNavbar'
import PanelSidebar from '@/components/bar/PanelSidebar'
import React from 'react'

export const metadata = {
    title: 'Panel | Super Shop',
    description: 'Panel Site of Super Shop'
}

const PanelMainLayout = ({ children }) => {
    
    return (
        <div className='w-full overflow-x-hidden relative pt-14'>
            <PanelNavbar />
            <PanelSidebar />
            {children}
        </div>
    )
}

export default PanelMainLayout
