import React from 'react'
import dayjs from 'dayjs'

function JobCard() {
    const skills = ["JavaScript", "React", "Node.js"];
    const date1 = dayjs(Date.now());
    const diffInDays = date1.diff('2023-06-01', 'day');
  return (
    <div className='mx-40 mb-4'>
        <div className='flex justify-between items-center bg-zinc-200 rounded-md px-6 py-4 rounded-md border 
                        border-black shadow-lg hover:border-blue-500 hover:shadow-blue-500 hover:translate-y-1 hover: scale-103'>
            <div>
                <h1>Frontend Developer - Amazon</h1>
                <p>Full Time &#x2022; Internship &#x2022; On-site</p>
                <div>
                    {skills.map((skill) => {
                        <p>(skill)</p>
                    })}
                </div>
            </div>
            <div>
                <p>Posted {diffInDays} days ago</p>
                <button>Apply</button>
            </div>
        </div>
    </div>
  )
}

export default JobCard