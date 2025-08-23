import React from 'react'
import Headers from '../Others/Headers'
import TaskListNumbers from '../Others/TaskListNumbers'
import TaskList from '../TaskList/TaskList'

const EmployeeDashboard = () => {
  return (
    <div className='p-10 bg-[#1c1c1c] h-screen'>
     <Headers/>
     <TaskListNumbers/>
     <TaskList/>
    </div>
  )
}

export default EmployeeDashboard
