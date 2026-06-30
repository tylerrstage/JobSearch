import Navbar from './components/Navbar'
import Header from './components/Header'
import Searchbar from './components/Searchbar'
import JobCard from './components/JobCard'
import JobData from './JobDummyData'
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from './firebase.config.js';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const [jobs, setJobs] = useState([]);
  const [customSearch, setCustomSearch] = useState(false);

  const fetchJobs = async() => {
    setCustomSearch(false);
    const tempJobs =[]
    const jobsRef = query(collection(db, "jobs"));
    const q = query(jobsRef, orderBy("postedOn", "desc"));
    const req = await getDocs(q);
    req.forEach((job) => {
      // console.log(doc.id, " => ", doc.data());
      tempJobs.push({
        ...job.data(),
        id: job.id,
        postedOn: job.data().postedOn.toDate()
      });
    });
    setJobs(tempJobs);
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
      // console.log(doc.id, " => ", doc.data());
      tempJobs.push({
        ...job.data(),
        id: job.id,
        postedOn: job.data().postedOn.toDate()
      });
    });
    setJobs(tempJobs);
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return (
    <div>
      <Navbar />
      <Header />
      <Searchbar fetchJobsCustom={fetchJobsCustom} />
      {customSearch && 
      <button onClick={fetchJobs} className='flex mb-2 hover:cursor-pointer'>
        <p className="bg-blue-500 text-white py-2 px-10 rounded-md">Clear Filters</p>
      </button>}
      {jobs.map((job) => (
        <JobCard key={job.id} {...job}/>
      ))}
    </div>
  )
}

export default App
