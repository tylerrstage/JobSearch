import React from 'react'

function SearchIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

/**
 * CitySearch
 * A standalone search bar that lets the user filter jobs by city.
 * The typed value is controlled by the parent so it can be combined with
 * the filters in the main Searchbar component when a search is triggered.
 *
 * Props:
 * - value: string                The current city search text
 * - onChange: (value) => void    Fires as the user types
 * - onSearch: () => void         Fires when the user presses Enter
 */
function CitySearch({ value = '', onChange, onSearch }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSearch?.()
    }
  }

  return (
    <div className='flex justify-center px-10 pt-6'>
      <div className='flex w-full max-w-md items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 shadow-sm transition-colors focus-within:border-blue-500'>
        <SearchIcon className='text-gray-400' />
        <input
          type='text'
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Search by city...'
          aria-label='Search jobs by city'
          className='w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400'
        />
      </div>
    </div>
  )
}

export default CitySearch
