import Header from '@/components/Header'
import React from 'react'
import { Outlet } from 'react-router'

const AppLayout = () => {
  return <div className='min-h-screen'>
    <div className='grid-background' aria-hidden='true'></div>
    <Header />
    <main className='relative mx-auto min-h-[calc(100vh-5rem)] w-full max-w-7xl px-4 sm:px-8'>
      <div className='py-8 sm:py-12'><Outlet /></div>
    </main>
  </div>
}

export default AppLayout
