'use client';
import React from 'react'
const Dashboard = ({user}: {user: {email: string}}) => {
    const handleLogout = () => {
        console.log('logout');
    }
  return (
        <header className='flex justify-between items-center p-4 bg-white dark:bg-black'>
            <h1 className='text-2xl font-bold text-black dark:text-white'>Dashboard</h1>
            <div className='flex flex-row items-center gap-4'>
                <span className='text-white'>{user.email}</span>
                <button className='bg-gray-700 text-white px-4 py-2 rounded-md'
                onClick={handleLogout}
                >Log Out</button>
            </div>
        </header>
  )
}

export default Dashboard