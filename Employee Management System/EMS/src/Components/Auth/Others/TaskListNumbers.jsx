import React from 'react'

const TaskListNumbers = () => {
  return (
    
      <div className='flex  mt-10 justify-between gap-5 screen'>
        <div className='rounded-xl w-[45%] py-5 px-10 bg-red-400'>
            <h2 className='text-3xl font-semibold'>0</h2>
            <h2 className='text-xl font-medium'>NewTask</h2>
        </div>
        <div className='rounded-xl w-[45%] py-5 px-10 bg-blue-400'>
            <h2 className='text-3xl font-semibold'>0</h2>
            <h2 className='text-xl font-medium'>Completed Task</h2>
        </div>
        <div className='rounded-xl w-[45%] py-5 px-10 bg-green-400'>
            <h2 className='text-3xl font-semibold'>0</h2>
            <h2 className='text-xl font-medium'>Accepted Task</h2>
        </div>
        <div className='rounded-xl w-[45%] py-5 px-10 bg-yellow-400'>
            <h2 className='text-3xl font-semibold'>0</h2>
            <h2 className='text-xl font-medium'>Failed Task</h2>
        </div>
        

      </div>
   
  )
}

export default TaskListNumbers
