import React, { useState, useRef } from 'react'
import {useGSAP} from '@gsap/react'
import { gsap } from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../Components/LocationSearchPanel'

const Home = () => {
    const [pickup,setPickup]=useState("")
    const [destination,setDestination]=useState("")
    const[panelOpen,setPanelOpen]=useState(false)
    const panelRef = useRef()
    const panelCloseRef=useRef(null)

    const submitHandler=(e)=>{
        e.preventDefault()
    }


    useGSAP(function(){
  if(panelOpen){
    gsap.to(panelRef.current,{ height: '70%', padding: '20'})
    gsap.to(panelCloseRef.current,{opacity:1})
  } else{
    gsap.to(panelRef.current,{ height: '0%', })
  }
}, [panelOpen,panelCloseRef])



  


  return (
    <div className='h-screen relative'>
      <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />


      <div className='h-screen w-screen'>
        <img className='h-full w-full object-cover ' src="https://imgs.search.brave.com/fCxSfD5e8n-nqDSaTj3yBcaZFwlRmsM26kNqIcg5i6k/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE4/ODM5NDAwNi92ZWN0/b3IvcGVyc29uLXVz/aW5nLWEtcmlkZS1z/aGFyaW5nLXRlY2hu/b2xvZ3ktbW9iaWxl/LWFwcGxpY2F0aW9u/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1lbG0wdVZQbHVo/dEZ2QWZEM0E5Z0ds/cmdtV01XTHk3eUJO/WUtHbXNZNGU0PQ" alt="" />
      </div>
      <div className='bg-white flex flex-col justify-end top-0  h-screen absolute  w-full'>
        <div className='h-[30%] bg-white p-6 relative '>
            <h5 ref={panelCloseRef} onClick={()=>{
                setPanelOpen(false)
            }} className=' opacity-0 absolute right-6 top-6 text-2xl'><i class="ri-arrow-down-wide-line"></i></h5>
            <h4 className='text-2xl font-semibold'>Find a Trip </h4>
        <form onSubmit={(e)=>{
            submitHandler(e)
        }
        }>
            <div className="line absolute h-16 w-1 top-[40%] left-10 bg-gray-900 rounded-full"></div>
            <input  onClick={()=>{
                setPanelOpen(true)
            }}
            value={pickup} onChange={(e)=>{
                setPickup(e.target.value)
            }}
            className='bg-[#eee]  py-2 text-base rounded-lg w-full mt-5 px-12' type="text" placeholder='add a pickup location' />
            <input  
            onClick={()=>{
                setPanelOpen(true)
            }}
            value={destination} onChange={(e)=>{
                setDestination(e.target.value)
            }
            }    
            className='bg-[#eee]  py-2 text-base rounded-lg w-full mt-3 px-12' type="text" placeholder='enter your destination' />
        </form>
        </div>
        <div ref={panelRef} className=' bg-white h-0 '>
            <LocationSearchPanel/>


        </div>
      </div>
    </div>
  )
}

export default Home
