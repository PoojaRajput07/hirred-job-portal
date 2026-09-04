import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import JobCard from '@/components/JobCard'
import { AppContext } from '@/Context/AppContext'
import { useNavigate } from 'react-router-dom'
import { fetchSaveJobs, searchFilter } from '@/axios/Axios'

const Jobs = () => {

  const [titleKeyword, setTitleKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [companyKeyword, setCompanyKeyword] = useState('');

  const [savedjobs, setSavedjobs] = useState([]);

  const {
    role,
    jobs,
    setJobs,
    fetchAllJobs
  } = useContext(AppContext);

  const navigate = useNavigate();

  const fetchsavejobs = async () => {
    try {
      const res = await fetchSaveJobs();

      setSavedjobs(res.data.savedjobs || []);

      console.log("saved jobs:", res.data.savedjobs);

    } catch (error) {
      console.log("error in fetching save jobs", error);
    }
  };

  useEffect(() => {
    fetchAllJobs();
    fetchsavejobs();
  }, []);

  useEffect(() => {
    if (titleKeyword || companyKeyword || location) {
      applyFilter();
    }
  }, [titleKeyword, companyKeyword, location]);

  const applyFilter = async () => {
    try {
      const res = await searchFilter(
        titleKeyword,
        companyKeyword,
        location
      );

      setJobs(res.data.job || []);

    } catch (error) {
      console.log('error in searching ', error);
    }
  };

  const clearFilters = () => {
    setTitleKeyword('');
    setLocation('');
    setCompanyKeyword('');
    fetchAllJobs();
  };

  return (
    <div className='flex flex-col gap-6'>

      <div className='flex flex-col gap-2'>
        <p className='text-sm font-semibold uppercase tracking-widest text-gray-400'>
          Opportunities
        </p>

        <h1 className='rammetto-one-regular text-3xl'>
          Find your next role
        </h1>

        <p className='text-gray-300'>
          Search open positions from teams looking for their next hire.
        </p>
      </div>

      <div className='rounded-lg border border-gray-700 bg-gray-900/40 p-4'>

        <div className='flex flex-col gap-3 lg:flex-row'>

          <Input
            value={titleKeyword}
            onChange={(e) => setTitleKeyword(e.target.value)}
            placeholder='Job title or keyword'
          />

          <Input
            value={companyKeyword}
            onChange={(e) => setCompanyKeyword(e.target.value)}
            placeholder='Company name'
          />

          <Select
            value={location}
            onValueChange={setLocation}
          >
            <SelectTrigger>
              <SelectValue placeholder='Any location' />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>

                <SelectLabel>
                  Location
                </SelectLabel>

                {[
                  'Remote',
                  'Hybrid',
                  'Mumbai',
                  'Hyderabad',
                  'Gurugram',
                  'Noida',
                  'Pune'
                ].map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}

              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            variant='secondary'
            onClick={applyFilter}
          >
            Search
          </Button>

          <Button
            variant='outline'
            onClick={clearFilters}
          >
            Clear
          </Button>

        </div>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-3'>

        <p className='text-sm text-gray-400'>
          {jobs.length}{' '}
          {jobs.length === 1
            ? 'opportunity'
            : 'opportunities'}{' '}
          found
        </p>

        <div className='flex gap-2'>

          {role === 'recruiter' ? (

            <Button
              variant='outline'
              onClick={() => navigate('/myjobs')}
            >
              Manage my jobs
            </Button>

          ) : (

            <>
              <Button
                variant='outline'
                onClick={() => navigate('/savejobs')}
              >
                Saved jobs
              </Button>

              <Button
                variant='outline'
                onClick={() => navigate('/appliedjobs')}
              >
                Applications
              </Button>
            </>

          )}

        </div>
      </div>

      {jobs.length === 0 ? (

        <div className='rounded-lg border border-dashed border-gray-600 p-12 text-center'>

          <h2 className='text-lg font-semibold'>
            No jobs found
          </h2>

          <p className='mt-2 text-gray-400'>
            Try changing your search or clearing the filters.
          </p>

        </div>

      ) : (

        <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>

          {jobs.map((job) => (

            <li key={job._id}>

              <JobCard
               
                curElem={job}
                savedjobs={savedjobs}
              />

            </li>

          ))}

        </ul>

      )}

    </div>
  )
}

export default Jobs