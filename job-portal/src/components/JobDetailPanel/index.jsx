import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from '../Searchbar/FilterDropdown'

const DESCRIPTION_COLLAPSED_HEIGHT = 120 // px, roughly 5 lines at text-sm/leading-6

function JobDetailPanel({ job }) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isLongDescription, setIsLongDescription] = useState(false)
  const descriptionRef = useRef(null)

  useEffect(() => {
    setIsDescriptionExpanded(false)
  }, [job?.id])

  // Detect whether the description overflows the collapsed height so we know
  // whether to show the fade mask + "Read more" toggle. scrollHeight reflects
  // the full content size regardless of the max-height/overflow clipping, so
  // this works whether the description is currently collapsed or expanded.
  useLayoutEffect(() => {
    const element = descriptionRef.current
    if (!element) return

    const checkOverflow = () => {
      setIsLongDescription(element.scrollHeight > DESCRIPTION_COLLAPSED_HEIGHT + 1)
    }

    checkOverflow()

    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [job?.id, job?.description])

  if (!job) {
    return (
      <div className='flex h-full items-center justify-center p-8 text-center text-gray-500'>
        Select a job to view more details.
      </div>
    )
  }

  const skills = Array.isArray(job.skills) && job.skills.length > 0 ? job.skills : ['No skills listed']
  const description = job.description || 'A great opportunity to join a growing team and make an impact.'

  const descriptionStyle = isDescriptionExpanded
    ? undefined
    : {
        maxHeight: `${DESCRIPTION_COLLAPSED_HEIGHT}px`,
        overflow: 'hidden',
        ...(isLongDescription && {
          maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
        }),
      }

  return (
    <div className='p-6'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <p className='text-sm font-medium uppercase tracking-wide text-navy-700'>Job details</p>
          <h2 className='mt-1 text-2xl font-semibold text-gray-900'>{job.title}</h2>
          <p className='text-lg text-gray-700'>{job.company}</p>
        </div>
        <a href={job.job_link} target='_blank' rel='noreferrer'>
          <button className='rounded-full border border-ink-900 bg-ink-900 px-6 py-2 text-white transition cursor-pointer hover:bg-ink-800 active:bg-black'>
            Apply
          </button>
        </a>
      </div>

      <div className='mt-6 grid gap-3 sm:grid-cols-2'>
        <div className='rounded-lg border border-accent-200/70 bg-gray-50 p-3'>
          <p className='text-500 font-semibold text-navy-800'>Location</p>
          <p className='text-500 font-bold text-gray-900'>{job.location}</p>
        </div>
        <div className='rounded-lg border border-accent-200/70 bg-gray-50 p-3'>
          <p className='text-500 font-semibold text-navy-800'>Salary</p>
          <p className='text-500 font-bold text-gray-900'>{job.salary || 'Salary not listed'}</p>
        </div>
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
      
      <div className='mt-6'>
        <h3 className='text-lg font-semibold text-gray-900'>Description</h3>
        <p
          ref={descriptionRef}
          className='mt-2 text-sm leading-6 text-gray-700 transition-[max-height] duration-300'
          style={descriptionStyle}
        >
          {description}
        </p>
        {isLongDescription && (
          <button
            type='button'
            onClick={() => setIsDescriptionExpanded((prev) => !prev)}
            className='mt-2 flex items-center gap-1 text-sm font-semibold text-navy-700 transition hover:text-navy-800 cursor-pointer'
          >
            {isDescriptionExpanded ? 'Read less' : 'Read more'}
            <ChevronDownIcon
              className={`transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>
    </div>
  )
}

export default JobDetailPanel
