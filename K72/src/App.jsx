import React from 'react'
import { Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Agence from './pages/Agence'
import Projects from './pages/Projects'
import { Link } from 'react-router-dom'
import Stairs from './components/common/stairs'

const App = () => {
  

  
  
  return (
   <div>
     <div className='text-white'>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/agence' element={<Agence/>} />
        <Route path='/Projects' element={<Projects/>} />
      </Routes>
    </div>
   </div>
  )
}

export default App

