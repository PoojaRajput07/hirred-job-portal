import { Button } from '@/components/ui/button'
import { AppContext } from '@/Context/AppContext';
import { logout } from '@/axios/Axios';
import { toast } from 'react-toastify';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setLogin, setRole, role } = useContext(AppContext);
  const isRecruiter = role === 'recruiter';
  const navItems = login ? (isRecruiter
    ? [['/jobs', 'Browse jobs'], ['/myjobs', 'My jobs'], ['/postajob', 'Post a job']]
    : [['/jobs', 'Find jobs'], ['/savejobs', 'Saved'], ['/appliedjobs', 'Applications']]) : [];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
      setLogin(false);
      setRole(null);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to log out');
    }
  };

  return <header className='border-b border-gray-700/70 px-4 sm:px-8'>
    <nav className='mx-auto flex min-h-20 max-w-6xl flex-wrap items-center justify-between gap-4'>
      <Link to='/' aria-label='Hirred home'><img src='/logo.png' alt='Hirred' className='h-10 md:h-14' /></Link>
      <div className='order-3 flex w-full items-center gap-2 overflow-x-auto pb-3 sm:order-2 sm:w-auto sm:pb-0'>
        {navItems.map(([href, label]) => <Link key={href} to={href} className={`whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${location.pathname === href ? 'bg-secondary text-secondary-foreground' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>{label}</Link>)}
      </div>
      <div className='order-2 flex items-center gap-3 sm:order-3'>
        {login && <span className='rounded-full border border-gray-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-300'>{isRecruiter ? 'Recruiter' : 'Candidate'}</span>}
        <Button variant='outline' onClick={() => login ? handleLogout() : navigate('/login')}>{login ? 'Log out' : 'Log in'}</Button>
      </div>
    </nav>
  </header>
}

export default Header
