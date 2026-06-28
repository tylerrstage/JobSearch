import React from 'react'

function Searchbar() {
  return (
    <div className='flex gap-4 my-10 justify-center px-10'>
        <select className='w-64 py-3 pl-4 bg-zinc-200 font-semibold rounded-md cursor-pointer'>
            <option value="" disabled hidden selected>Job Role</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
        </select>

        <select className='w-64 py-3 pl-4 bg-zinc-200 font-semibold rounded-md cursor-pointer'>
            <option value="" disabled hidden selected>Job Type</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
        </select>

        <select className='w-64 py-3 pl-4 bg-zinc-200 font-semibold rounded-md cursor-pointer'>
            <option value="" disabled hidden selected>Location</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
        </select>

        <select className='w-64 py-3 pl-4 bg-zinc-200 font-semibold rounded-md cursor-pointer'>
            <option value="" disabled hidden selected>Experience</option>
            <option value="Intern">Intern</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
        </select>

        <button className='w-64 bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-blue-600 cursor-pointer'>Search</button>
    </div>
  )
}

export default Searchbar