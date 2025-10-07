import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Agence from './pages/Agence'
import Projects from './pages/Projects'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const App = () => {



  useGSAP(function(){

    const tl = gsap.timeline()
    tl.from('.stair',{
      height:0,
      stagger:{
        amount: -0.25
      }
    })

    tl.to('.stair',{
      y: '100%',
      stagger: {
        amount: -0.25
      }

    })

  })
  return (
    <div className='text-white'>

     <div className='h-screen w-full fixed z-20 top-0'>
       <div className='h-full w-full flex fixed z-10 top-0'>
        <div className='stair h-full w-1/5 bg-black'></div>
        <div className='stair h-full w-1/5 bg-black'></div>
        <div className='stair h-full w-1/5 bg-black'></div>
        <div className='stair h-full w-1/5 bg-black'></div>
        <div className='stair h-full w-1/5 bg-black'></div>
      </div>
     </div>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/agence' element={<Agence/>} />
        <Route path='/Projects' element={<Projects/>} />
      </Routes>
    </div>
  )
}

export default App

