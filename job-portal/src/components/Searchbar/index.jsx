import React from 'react'
import { useState } from 'react'
import FilterDropdown from './FilterDropdown'
import { ResetAllFiltersButton } from './ResetAllFiltersButton'

function Searchbar(props) {
    const [jobCriteria, setJobCriteria] = useState({
        title: [],
        location: [],
        experience: [],
        type: []
    })
    const [resetKey, setResetKey] = useState(0)

    const handleChange = (field, value) => {
        setJobCriteria((prevState) => ({
            ...prevState,
            [field]: value
        }))
    }

    const search = async() => {
        const criteria = {
            title: jobCriteria.title[0] || "",
            location: jobCriteria.location[0] || "",
            experience: jobCriteria.experience[0] || "",
            type: jobCriteria.type[0] || ""
        }
        await props.fetchJobsCustom(criteria);
    }

    const hasActiveFilters = Object.values(jobCriteria).some((value) => value.length > 0)

    const resetAllFilters = async() => {
        setJobCriteria({
            title: [],
            location: [],
            experience: [],
            type: []
        })
        setResetKey((prev) => prev + 1)

        if (props.onClearFilters) {
            await props.onClearFilters()
        }
    }

  return (
    <div className='flex flex-wrap gap-4 my-10 justify-center px-10'>
        <FilterDropdown
            key={`title-${resetKey}`}
            label="Job Role"
            options={["Frontend Developer", "Backend Developer", "Full Stack Developer"]}
            defaultSelected={jobCriteria.title}
            onChange={(value) => handleChange('title', value)}
        />

        <FilterDropdown
            key={`type-${resetKey}`}
            label="Job Type"
            options={["Full Time", "Part Time", "Contract"]}
            defaultSelected={jobCriteria.type}
            onChange={(value) => handleChange('type', value)}
        />

        <FilterDropdown
            key={`location-${resetKey}`}
            label="Location"
            options={["Remote", "On-site", "Hybrid"]}
            defaultSelected={jobCriteria.location}
            onChange={(value) => handleChange('location', value)}
        />

        <FilterDropdown
            key={`experience-${resetKey}`}
            label="Experience"
            options={["Intern", "Junior", "Senior"]}
            defaultSelected={jobCriteria.experience}
            onChange={(value) => handleChange('experience', value)}
        />

        <ResetAllFiltersButton onReset={resetAllFilters} label="Reset filters" disabled={!hasActiveFilters} />

        <button onClick={search} className='bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 cursor-pointer'>Search</button>
    </div>
  )
}

export default Searchbar