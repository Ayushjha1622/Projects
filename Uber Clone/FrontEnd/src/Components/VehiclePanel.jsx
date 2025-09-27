import React from 'react'

const VehiclePanel = (props) => {
  return (
    <div>
       <h5  onClick={()=>{
      props.setVehiclePanel(false)
     }} className='p-3 text-center w-[93%] absolute top-0 '> <i class="ri-arrow-down-wide-line text-3xl text-gray-400"></i></h5>
      <h3 className='text-lg font-semibold  mb-5'>Choose a Vehicle </h3>
        <div onClick={()=>{
            props.setConfirmRide(true)
            props.setVehiclePanel(false)
        }} className='w-full p-3 border-2 active:border-black rounded-xl  flex items-center justify-between mb-2'>
        <img className='h-12'  src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"  alt='image'/>
        <div className=' w-1/2 ml-4' >
          <h4 className='font-medium text-base'>UberGo  <span><i class="ri-user-3-fill"></i>4</span></h4>
          <h5 className='font-medium text-sm'>2 mins away</h5>
          <p className='font-normal text-xs text-gray-600'>Affordable, compact rides</p>
        </div>

        <h2 className='text-lg font-semibold'>₹193.20</h2>


      </div>
        <div  onClick={()=>{
            props.setConfirmRide(true)
            props.setVehiclePanel(false)
        }} className='w-full p-3 border-2 active:border-black rounded-xl  flex items-center justify-between mb-2'>
        <img className='h-12' src="https://imgs.search.brave.com/HjM4eEv-9ov7vM1fFqyEHSF7I3HTZOgvHnRxT2tJskM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9j/b29sLW1vdG9yY3lj/bGUtc3R1ZGlvXzIz/LTIxNTA3ODE3MTQu/anBnP3NlbXQ9YWlz/X2luY29taW5nJnc9/NzQwJnE9ODA" alt='image'/>
        <div className=' w-1/2 ml-4'>
          <h4 className='font-medium text-base'>UberBike  <span><i class="ri-user-3-fill"></i>1</span></h4>
          <h5 className='font-medium text-sm'>2 mins away</h5>
          <p className='font-normal text-xs text-gray-600'>Affordable,Bike rides</p>
        </div>

        <h2 className='text-lg font-semibold'>₹79.20</h2>


      </div>
        <div  onClick={()=>{
            props.setConfirmRide(true)
            props.setVehiclePanel(false)
        }} className='w-full p-3 border-2 active:border-black rounded-xl  flex items-center justify-between mb-2'>
        <img className='h-12' src="https://imgs.search.brave.com/uOntCpSjOBgrBS7sANwz60GzMXFGZj0zeWTQtpT7KvM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzEwLzI0LzI1Lzk0/LzM2MF9GXzEwMjQy/NTk0ODNfZXhmek5k/dFgwNW9YTzU2dFNt/b0V4N3dhckZNN0M5/V3QuanBn" alt='image'/>
        <div className=' w-1/2 ml-13'>
          <h4 className='font-medium text-base'>UberAuto <span><i class="ri-user-3-fill"></i>3</span></h4>
          <h5 className='font-medium text-sm'>2 mins away</h5>
          <p className='font-normal text-xs text-gray-600'>Affordable,auto rides</p>
        </div>

        <h2 className='text-lg font-semibold'>₹140.20</h2>


      </div>
    </div>
  )
}

export default VehiclePanel
