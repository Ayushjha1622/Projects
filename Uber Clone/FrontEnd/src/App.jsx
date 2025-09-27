import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Start from './Pages/Start'
import Home from './Pages/Home'
import UserLogin from './Pages/UserLogin'
import UserSignup from './Pages/UserSignup'
import CaptainLogin from './Pages/CaptainLogin'
import CaptainSignup from './Pages/CaptainSignup'
import CaptainHome from './Pages/CaptainHome'
import UserLogout from './Pages/UserLogout'

import { UserDataContext } from './Context/UserContext'

import { useContext } from 'react'
import UserProtectedWrapper from './Pages/UserProtectedWrapper'
import CaptainProtectWrapper from './Pages/CaptainProtectedWrapper'
import Riding from './Pages/Riding'

const App = () => {
  const ans = useContext(UserDataContext)
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start/>} />
        <Route path="/login" element={<UserLogin/>} />
        <Route path="/signup" element={<UserSignup/>} />
        <Route path="/captain-login" element={<CaptainLogin/>} />
        <Route path="/captain-signup" element={<CaptainSignup/>} />
        <Route  path='/home' element={<UserProtectedWrapper>
          <Home/>
        </UserProtectedWrapper>}/>

          <Route path="/user/logout" element={
            <UserProtectedWrapper>
              <UserLogout/>
            </UserProtectedWrapper>
          } />
          <Route path="/captain-home" element={<CaptainProtectWrapper>
            <CaptainHome/>
          </CaptainProtectWrapper>} />
          <Route path='/riding' element={<Riding/>}/>

      </Routes>
    </div>
  )
}

export default App