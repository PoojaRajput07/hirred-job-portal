import { madeCandidate, madeRecruiter } from '@/axios/Axios';
import { Button } from '@/components/ui/button'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '@/Context/AppContext';

const Role = () => {
  const navigate = useNavigate();
  const { setRole } = useContext(AppContext);
  const handleRole = async (selectedRole) => {
    try {
      if (selectedRole === 'candidate') await madeCandidate();
      else await madeRecruiter();
      setRole(selectedRole);
      toast.success(`You are a ${selectedRole} now`);
      navigate(selectedRole === 'recruiter' ? '/postajob' : '/jobs');
    } catch (error) { toast.error(error.response?.data?.message || 'An error occurred while setting your role'); }
  };
  return <section className='mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center gap-8 text-center'>
    <div className='flex flex-col gap-3'><p className='text-sm font-semibold uppercase tracking-widest text-gray-400'>Set up your profile</p><h1 className='rammetto-one-regular text-3xl sm:text-4xl'>How will you use Hirred?</h1><p className='text-gray-300'>Choose a role to personalize your job portal experience. You can update your profile later.</p></div>
    <div className='grid gap-4 sm:grid-cols-2'><Button variant='secondary' className='h-auto min-h-32 flex-col gap-2 p-6 text-left' onClick={() => handleRole('candidate')}><span className='text-xl font-bold'>I am a candidate</span><span className='font-normal text-secondary-foreground/80'>Find jobs, save opportunities, and manage applications.</span></Button><Button variant='destructive' className='h-auto min-h-32 flex-col gap-2 p-6 text-left' onClick={() => handleRole('recruiter')}><span className='text-xl font-bold'>I am a recruiter</span><span className='font-normal'>Post openings, manage listings, and find great candidates.</span></Button></div>
  </section>
}
export default Role
