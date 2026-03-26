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
        <div className='w-full py-14 md:py-0 md:pt-20 px-1  relative overflow-x-hidden'>
            <Navbar />
            <div className='w-full min-h-screen '>{children}</div>
            <Footer />
            <Bottombar/>
        </div>
    )
}

export default HomePageLayout
