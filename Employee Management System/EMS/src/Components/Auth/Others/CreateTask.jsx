import React, { useContext, useState } from 'react'
import { AuthContext } from '../../../Context/AuthProvider'


const CreateTask = () => {

  const [userData, setUserData] = useContext(AuthContext)

  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskDate, setTaskDate] = useState('')
  const [asignTo, setAsignTo] = useState('')
  const [category, setCategory] = useState('')

  const [newTask, setNewTask] = useState({})



  const submitHandler = (e) => {
    e.preventDefault()

    const createdTask = { taskTitle, taskDescription, taskDate, category, active: false, newTask: true, failed: false, completed: false }
    setNewTask(createdTask)

    if (!Array.isArray(userData)) return

    const trimmedAssignee = asignTo.trim()

    const updatedEmployees = userData.map((employee) => {
      if (employee.firstName === trimmedAssignee) {
        const updatedTasks = Array.isArray(employee.tasks) ? [...employee.tasks, createdTask] : [createdTask]
        return {
          ...employee,
          tasks: updatedTasks,
          taskCounts: {
            ...employee.taskCounts,
            newTask: (employee.taskCounts?.newTask || 0) + 1,
          },
        }
      }
      return employee
    })

    setUserData(updatedEmployees)
    try {
      localStorage.setItem('employees', JSON.stringify(updatedEmployees))
    } catch (err) {
      console.error('Failed to persist employees', err)
    }

    setTaskTitle('')
    setCategory('')
    setAsignTo('')
    setTaskDate('')
    setTaskDescription('')

  }


  return (
    <div className="p-5 bg-[#1c1c1c] mt-5 rounded">
      <form onSubmit={(e) => submitHandler(e)}
        className="flex  flex-wrap w-full  items-start justify-between">
        <div className="w-1/2">
          <h3 className='text-sm text-gray-300 mb-0.5'>Task Title</h3>
          <input
            value={taskTitle}
            onChange={(e) => {
              setTaskTitle(e.target.value)
            }}
            className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4' type="text" placeholder='Make a UI design' />

          <div>
            <h3 className='text-sm text-gray-300 mb-0.5'>Date</h3>
            <input
              value={taskDate}
              onChange={(e) => {
                setTaskDate(e.target.value)
              }}
              className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4' type="date" />
          </div>

          <div>
            <h3 className='text-sm text-gray-300 mb-0.5'>Assign to</h3>
            <select
              value={asignTo}
              onChange={(e) => setAsignTo(e.target.value)}
              className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4'
            >
              <option value="">Select employee</option>
              {Array.isArray(userData) && userData.map((emp) => (
                <option key={emp.id} value={emp.firstName}>{emp.firstName}</option>
              ))}
            </select>
          </div>

          <div>
            <h3 className='text-sm text-gray-300 mb-0.5'>Category</h3>
            <input
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
              }}
              className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4' type="text" placeholder='design, dev, etc' />
          </div>
        </div>

        <div className='w-2/5 flex flex-col items-start'>
          <h3 className='text-sm text-gray-300 mb-0.5'>Description</h3>
          <textarea
            value={taskDescription}
            onChange={(e) => {
              setTaskDescription(e.target.value)
            }}
            className='w-full h-44 text-sm py-2 px-4 rounded outline-none bg-transparent border-[1px] border-gray-400' name="" id=""></textarea>
        </div>

        <button className='bg-emerald-500 py-3 hover:bg-emerald-600 px-5 rounded text-sm mt-4 w-full'>Create Task</button>
      </form>
    </div>
  )
}

export default CreateTask
