import React, { useContext, useEffect, useState } from "react";
import Login from "./Components/Auth/Login";
import EmployeeDashboard from "./Components/Auth/DashBoard/EmployeeDashboard";
import AdminDashboard from "./Components/Auth/DashBoard/AdminDashboard";
import { AuthContext } from "./Context/AuthProvider";
import { getLocalStorage, setLocalStorage } from "./utils/LocalStorage";

const App = () => {

  const [user, setUser] = useState(null)
  const [loggedInUserData, setLoggedInUserData] = useState(null)
  const [userData,SetUserData] = useContext(AuthContext)

  useEffect(()=>{
    const loggedInUser = localStorage.getItem('loggedInUser')
    
    if(loggedInUser){
      const userData = JSON.parse(loggedInUser)
      setUser(userData.role)
      if (userData.data) {
        setLoggedInUserData(userData.data)
      }
    }

  },[])

  // Keep logged-in employee data in sync when employees update
  useEffect(() => {
    if (user === 'employee' && loggedInUserData && Array.isArray(userData)) {
      const updated = userData.find(e => e.email === loggedInUserData.email)
      if (updated) {
        setLoggedInUserData(updated)
        localStorage.setItem('loggedInUser', JSON.stringify({ role: 'employee', data: updated }))
      }
    }
  }, [userData, user])


  const handleLogin = (email, password) => {
    const { admin: admins = [], employees: storedEmployees = [] } = getLocalStorage()

    const adminMatch = Array.isArray(admins)
      ? admins.find((a) => a.email === email && a.password === password)
      : null

    if (adminMatch) {
      setUser('admin')
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin' }))
      return
    }

    const employees = Array.isArray(userData) ? userData : storedEmployees
    const employee = employees.find((e) => email === e.email && e.password === password)
    if (employee) {
      setUser('employee')
      setLoggedInUserData(employee)
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'employee', data: employee }))
    } else {
      alert("Invalid Credentials")
    }
  }



  return (
    <>
      {!user ? <Login handleLogin={handleLogin} /> : ''}
      {user == 'admin' ? <AdminDashboard changeUser={setUser} /> : (user == 'employee' ? <EmployeeDashboard changeUser={setUser} data={loggedInUserData} /> : null) }
    </>
  )
}

export default App