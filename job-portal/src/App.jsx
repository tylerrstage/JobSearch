import Navbar from './components/Navbar'
import Header from './components/Header'
import Searchbar from './components/Searchbar'
import JobCard from './components/JobCard'
import JobData from './JobDummyData'

function App() {

  return (
    <div>
      <Navbar />
      <Header />
      <Searchbar />
      {JobData.map((job) => (
        <JobCard key={job.id} {...job}/>
      ))}
    </div>
  )
}

export default App
