import Bottombar from '@/components/bar/Bottombar'
import Footer from '@/components/bar/Footer'
import Navbar from '@/components/bar/Navbar'
import React from 'react'

export const metadata={
    title:'Super Shop',
    description:'Demo Super Shop By Disibin'
}

const HomePageLayout = ({ children }) => {
    return (
        <div className='w-full py-14 sm:py-0 sm:pt-20 relative overflow-x-hidden'>
            <Navbar />
            {children}
            <Footer />
            <Bottombar/>
        </div>
    )
}

export default HomePageLayout
