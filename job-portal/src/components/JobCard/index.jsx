import React from 'react'
import dayjs from 'dayjs'
import "tailwindcss";

function JobCard() {
    const skills = ["JavaScript", "React", "Node.js"];
    const date1 = dayjs(Date.now());
    const diffInDays = date1.diff('2023-06-01', 'day');
  return (
    <div className='mx-40 mb-4'>
        <div className='flex justify-between items-center bg-zinc-200 rounded-md px-6 py-4 rounded-md border 
                        border-black shadow-lg hover:border-blue-400 hover:shadow-xl'>
            <div className='flex flex-col items-start gap-3'>
                <h1 className='text-lg font-semibold'>Frontend Developer - Amazon</h1>
                <p>Full Time &#x2022; Internship &#x2022; On-site</p>
                <div className='flex items-center gap-2'>
                    {skills.map((skill) => (
                        <p key={skill} className='text-gray-500 py-1 px-2 rounded-md border border-black'>{skill}</p>
                    ))}
                </div>
            </div>
            <div className='flex items-center gap-4'>
                <p className='text-gray-500'>Posted {diffInDays} days ago</p>
                <a href="">
                    <button className='text-blue-500 border border-blue-500 px-10 py-2 rounded-md cursor-pointer 
                    hover:bg-blue-500 hover:text-white'>Apply</button>
                </a>
            </div>
        </div>
    </div>
  )
}

export default JobCard