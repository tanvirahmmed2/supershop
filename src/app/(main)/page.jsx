import Brands from '@/components/pages/Brands'
import Categories from '@/components/pages/Categories'
import ForYou from '@/components/pages/ForYou'
import Intro from '@/components/pages/Intro'
import Service from '@/components/pages/Service'
import React from 'react'

const HomePage = () => {
  return (
    <div className='w-full flex flex-col gap-8'>
      <Intro/>
      <Categories/>
      <ForYou/>
      <Brands/>
      <Service/>
    </div>
  )
}

export default HomePage
