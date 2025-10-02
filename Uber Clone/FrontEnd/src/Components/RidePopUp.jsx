import React from 'react'

const RidePopUp = (props) => {
  return (
     <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>New Ride Available</h3>

            <div className='flex items-center justify-between mt-4 bg-yellow-300 rounded-lg p-3'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 w-10 rounded-full object-cover' src="https://imgs.search.brave.com/f70AOE2LklhxjXfeOvzGHfPYcHur4XuOQfR-O_ONmA4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Ym9yZWRwYW5kYS5j/b20vYmxvZy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNS8wMy80/NTk0MjkyMTVfODI1/NTcwOTYzMTAwNTY1/XzEyMjE4NjgzNzUy/NjcxMjAxMl9uLTY3/YzZiNmI1YTFmMzhf/XzcwMC5qcGc" alt="" />
                    
                <div className='text-lg font-medium'>Ayush jha</div>
                </div>

                <h5 className='text-lg font-semibold'>2.2 KM</h5>
            </div>

            <div className='flex gap-2 justify-between flex-col items-center'>
                
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Kankariya Talab, Bhopal</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Kankariya Talab, Bhopal</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹193.20 </h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                        </div>
                    </div>
                </div>
                <button onClick={()=>{
                    props.setConfirmRidePopupPanel(true);
                    props.setRidePopupPanel(false);
                }} className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Accept</button>
                <button onClick={()=>{
                 props.setRidePopupPanel(false)

                }} className='w-full mt-1 bg-gray-300 text-gray-700 font-semibold p-2 rounded-lg'>Ignore</button>
            </div>
    </div>
  )
}

export default RidePopUp
