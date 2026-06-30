import React from 'react'

function JobDetailPanel({ job }) {
  if (!job) {
    return (
      <div className='flex h-full items-center justify-center p-8 text-center text-gray-500'>
        Select a job to view more details.
      </div>
    )
  }

  const skills = Array.isArray(job.skills) && job.skills.length > 0 ? job.skills : ['No skills listed']

  return (
    <div className='p-6'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <p className='text-sm font-medium uppercase tracking-wide text-blue-600'>Job details</p>
          <h2 className='mt-1 text-2xl font-semibold text-gray-900'>{job.title}</h2>
          <p className='text-lg text-gray-700'>{job.company}</p>
        </div>
        <a href={job.job_link} target='_blank' rel='noreferrer'>
          <button className='rounded-md border border-blue-500 bg-blue-500 px-6 py-2 text-white transition cursor-pointer hover:bg-blue-600'>
            Apply
          </button>
        </a>
      </div>

      <div className='mt-6 grid gap-3 sm:grid-cols-2'>
        <div className='rounded-lg bg-gray-50 p-3'>
          <p className='text-500 font-semibold text-gray-700'>Location</p>
          <p className='text-500 font-bold text-gray-900'>{job.location}</p>
        </div>
        <div className='rounded-lg bg-gray-50 p-3'>
          <p className='text-500 font-semibold text-gray-700'>Salary</p>
          <p className='text-500 font-bold text-gray-900'>{job.salary || 'Salary not listed'}</p>
        </div>
      </div>

      <div className='mt-6'>
        <h3 className='text-lg font-semibold text-gray-900'>Description</h3>
        <p className='mt-2 text-sm leading-6 text-gray-700'>
          {job.description || 'A great opportunity to join a growing team and make an impact.'}
        </p>
      </div>

      <div className='mt-6'>
        <h3 className='text-lg font-semibold text-gray-900'>Skills</h3>
        <div className='mt-3 flex flex-wrap gap-2'>
          {skills.map((skill) => (
            <span key={skill} className='rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700'>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className='mt-6'>
        <h3 className='text-lg font-semibold text-gray-900'>Additional info</h3>
        <ul className='mt-2 space-y-2 text-sm text-gray-700'>
          <li><span className='font-semibold'>Type:</span> {job.type}</li>
          <li><span className='font-semibold'>Experience:</span> {job.experience}</li>
          <li><span className='font-semibold'>Posted:</span> {job.postedOn ? new Date(job.postedOn).toLocaleDateString() : 'Recently posted'}</li>
        </ul>
      </div>
    </div>
  )
}

export default JobDetailPanel
