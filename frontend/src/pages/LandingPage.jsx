import { Button } from '@/components/ui/button'
import { AppContext } from '@/Context/AppContext';
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const { login, role } = useContext(AppContext);
  const destination = login ? (role === 'recruiter' ? '/postajob' : '/jobs') : '/signup';

  return <div className='flex flex-col gap-12'>
    <section className='mx-auto flex max-w-4xl flex-col items-center gap-6 pt-8 text-center sm:pt-12'>
      <p className='text-sm font-semibold uppercase tracking-[0.25em] text-gray-400'>The smarter way to get hired</p>
      <h1 className='rammetto-one-regular text-balance text-3xl leading-tight sm:text-5xl lg:text-6xl'>Find your dream job and get hired</h1>
      <p className='max-w-2xl text-pretty text-base leading-6 text-gray-300 sm:text-lg'>Discover meaningful opportunities, build your career, and help great teams find their next standout hire.</p>
      <div className='flex flex-wrap justify-center gap-3'>
        <Button variant='secondary' className='px-6' onClick={() => navigate('/jobs')}>Find a job</Button>
        <Button variant='destructive' className='px-6' onClick={() => navigate(destination)}>{role === 'recruiter' ? 'Post a job' : 'Get started'}</Button>
      </div>
    </section>
    <img src='/banner.jpeg' alt='People collaborating at work' className='h-48 w-full rounded-lg object-cover sm:h-72' />
    <section className='grid gap-4 md:grid-cols-2'>
      <button onClick={() => navigate('/jobs')} className='rounded-lg border border-gray-700 bg-[#01172f] p-6 text-left transition hover:border-gray-500'>
        <h2 className='text-xl font-bold'>For candidates</h2><p className='mt-2 leading-6 text-gray-300'>Search relevant roles, save your favorites, and track every application from one place.</p><span className='mt-5 inline-block text-sm font-semibold text-gray-200'>Explore jobs →</span>
      </button>
      <button onClick={() => navigate(login && role === 'recruiter' ? '/postajob' : '/role')} className='rounded-lg border border-gray-700 bg-[#01172f] p-6 text-left transition hover:border-gray-500'>
        <h2 className='text-xl font-bold'>For recruiters</h2><p className='mt-2 leading-6 text-gray-300'>Reach qualified talent, manage your listings, and build your next great team.</p><span className='mt-5 inline-block text-sm font-semibold text-gray-200'>{login ? 'Post a job →' : 'Start hiring →'}</span>
      </button>
    </section>
  </div>
}

export default LandingPage
