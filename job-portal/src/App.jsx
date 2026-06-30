import Navbar from './components/Navbar'
import Header from './components/Header'
import CitySearch from './components/CitySearch'
import Searchbar from './components/Searchbar'
import JobCard from './components/JobCard'
import JobDetailPanel from './components/JobDetailPanel'
import JobData from './JobDummyData'
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from './firebase.config.js';
import { stripOtherLocationsSuffix, jobMatchesCity } from './utils/location.js';
import { useState, useRef } from 'react';
import { useEffect } from 'react';

function App() {
  const [allJobs, setAllJobs] = useState(JobData);
  const [jobs, setJobs] = useState(JobData);
  const [customSearch, setCustomSearch] = useState(false);
  const [selectedJob, setSelectedJob] = useState(JobData[0]);
  const [cityQuery, setCityQuery] = useState('');
  const searchbarRef = useRef(null);

  const fetchJobs = async() => {
    setCustomSearch(false);
    setCityQuery('');
    const tempJobs =[]
    const jobsRef = query(collection(db, "jobs"));
    const q = query(jobsRef, orderBy("postedOn", "desc"));
    const req = await getDocs(q);
    req.forEach((job) => {
      tempJobs.push({
        ...job.data(),
        id: job.id,
        location: stripOtherLocationsSuffix(job.data().location),
        postedOn: job.data().postedOn.toDate()
      });
    });
    setAllJobs(tempJobs);
    setJobs(tempJobs);
    setSelectedJob(tempJobs[0] || null);
  }

  const getWorkplaceType = (job) => {
    if (job.workplaceType) return job.workplaceType;
    if (['Remote', 'On-site'].includes(job.location)) return job.location;
    return job.isRemote ? 'Remote' : 'On-site';
  };

  const fetchJobsCustom = async(jobCriteria) => {
    setCustomSearch(true);

    const normalizedCriteria = {
      title: jobCriteria.title || [],
      location: jobCriteria.location || [],
      experience: jobCriteria.experience || [],
      type: jobCriteria.type || [],
      city: jobCriteria.city || ''
    };

    const filteredJobs = allJobs.filter((job) => {
      const matchesTitle = normalizedCriteria.title.length === 0 || normalizedCriteria.title.includes(job.title);
      const matchesLocation = normalizedCriteria.location.length === 0 || normalizedCriteria.location.includes(getWorkplaceType(job));
      const matchesExperience = normalizedCriteria.experience.length === 0 || normalizedCriteria.experience.includes(job.experience);
      const matchesType = normalizedCriteria.type.length === 0 || normalizedCriteria.type.includes(job.type);
      const matchesCity = jobMatchesCity(job, normalizedCriteria.city);

      return matchesTitle && matchesLocation && matchesExperience && matchesType && matchesCity;
    });

    setJobs(filteredJobs);
    setSelectedJob(filteredJobs[0] || null);
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return (
    <div>
      <Navbar customSearch={customSearch} onClearFilters={fetchJobs} />
      <Header />
      <CitySearch
        value={cityQuery}
        onChange={setCityQuery}
        onSearch={() => searchbarRef.current?.triggerSearch()}
      />
      <Searchbar ref={searchbarRef} cityQuery={cityQuery} fetchJobsCustom={fetchJobsCustom} onClearFilters={fetchJobs} />
      <div className='mx-60 mt-4 flex h-[63vh] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:flex-row'>
        <div className='w-full overflow-y-auto border-b border-gray-200 lg:w-[38%] lg:border-b-0 lg:border-r'>
          <div className='p-3'>
            {jobs.map((job) => (
              <div key={job.id} onClick={() => setSelectedJob(job)} className='cursor-pointer'>
                <JobCard {...job} isSelected={selectedJob?.id === job.id} />
              </div>
            ))}
          </div>
        </div>
        <div className='w-full overflow-y-auto lg:w-[62%]'>
          <JobDetailPanel job={selectedJob} />
        </div>
      </div>
    </div>
  )
}

export default App
