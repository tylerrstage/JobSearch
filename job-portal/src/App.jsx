import Navbar from './components/Navbar'
import Header from './components/Header'
import Searchbar from './components/Searchbar'
import JobCard from './components/JobCard'
import JobDetailPanel from './components/JobDetailPanel'
import JobData from './JobDummyData'
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from './firebase.config.js';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const [jobs, setJobs] = useState(JobData);
  const [customSearch, setCustomSearch] = useState(false);
  const [selectedJob, setSelectedJob] = useState(JobData[0]);

  const fetchJobs = async() => {
    setCustomSearch(false);
    const tempJobs =[]
    const jobsRef = query(collection(db, "jobs"));
    const q = query(jobsRef, orderBy("postedOn", "desc"));
    const req = await getDocs(q);
    req.forEach((job) => {
      tempJobs.push({
        ...job.data(),
        id: job.id,
        postedOn: job.data().postedOn.toDate()
      });
    });
    setJobs(tempJobs);
    setSelectedJob(tempJobs[0] || null);
  }

  const fetchJobsCustom = async(jobCriteria) => {
    setCustomSearch(true);
    const tempJobs =[]
    const jobsRef = query(collection(db, "jobs"));
    const q = query(jobsRef, where("type", "==", jobCriteria.type), where("title", "==", jobCriteria.title), 
    where("location", "==", jobCriteria.location), where("experience", "==", jobCriteria.experience), 
    orderBy("postedOn", "desc"));
    const req = await getDocs(q);

    req.forEach((job) => {
      tempJobs.push({
        ...job.data(),
        id: job.id,
        postedOn: job.data().postedOn.toDate()
      });
    });
    setJobs(tempJobs);
    setSelectedJob(tempJobs[0] || null);
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return (
    <div>
      <Navbar customSearch={customSearch} onClearFilters={fetchJobs} />
      <Header />
      <Searchbar fetchJobsCustom={fetchJobsCustom} onClearFilters={fetchJobs} />
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
