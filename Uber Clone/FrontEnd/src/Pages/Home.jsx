import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div> 
      <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1527603815363-e79385e0747e?q=80&w=376&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8  flex w-full justify-between flex-col'> 
        <img className='w-16 ml-8' src="https://imgs.search.brave.com/rPQtJtJ4lnluRUNS08H5hdypBrod6dgW7mB6dclyWWs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/bG9nby53aW5lL2Ev/bG9nby9VYmVyL1Vi/ZXItV2hpdGUtRGFy/ay1CYWNrZ3JvdW5k/LUxvZ28ud2luZS5z/dmc" alt="image" />
        <div className='bg-white pb-7 py-4 px-4'>
        <h2 className='text-[30px] font-bold'>Get Started with Uber</h2>
        <Link to='/login' className='flex items-center justify-center w-full bg-black text-white py-3 rounded mt-4'> Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Home
