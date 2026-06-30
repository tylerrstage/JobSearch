import React from 'react'

function JobCard({ title, company, location, salary, city, state, isRemote, isSelected, onClick }) {
  return (
    <div
      className={`mb-3 rounded-lg border p-4 transition ${isSelected ? 'border-accent-400 bg-accent-200/25 shadow-sm' : 'border-gray-200 bg-white hover:border-accent-300 hover:bg-gray-50'}`}
      onClick={onClick}
    >
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h3 className='text-base font-semibold text-gray-900'>{title}</h3>
          <p className='text-sm text-gray-800'>{company}</p>
          <p className='text-sm text-gray-600'>{location}</p>
        </div>
        <div className='text-right text-400 font-semibold text-gray-600'>
          <p className='text-gray-900'>{salary || 'Salary not listed'}</p>
          <p>{isRemote ? 'Remote' : 'On-site'}</p>
        </div>
      </div>
    </div>
  )
}

export default JobCard