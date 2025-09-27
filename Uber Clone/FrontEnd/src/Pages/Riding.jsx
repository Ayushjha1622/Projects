import React from 'react'

const Riding = () => {
  return (
    <div className='h-screen'>
      <div className='h-1/2'>
        
      </div>

      <div className='h-1/2 p-4 '>
       <div className='flex items-center justify-between' >
        <img
          className="h-12"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt=""
        />
       <div className='text-right'>
         <h2 className='text-lg font-medium'>Ayush</h2>
        <h4 className='text-xl font-semibold -mt-2'>MP04 AB 1024</h4>
        <p className='text-sm text-gray-600 '>Maruti Suzuki Alto</p>
       </div>

       </div>

        <div className="w-full mt-5">
         
          <div  className="flex items-center gap-2 p-3 border-b-2">
            <i class="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                Kankariya Talab, Bhopal
              </p>
            </div>
          </div>
          <div  className="flex items-center gap-2 p-3 ">
            <i class="ri-money-rupee-circle-fill"></i>
            <div>
              <h3 className="text-lg font-medium">₹192.20</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
        <button className="w-full bg-green-600 text-white mt-5 font-semibold p-2 rounded-lg">Make a Payment</button>
        
        
      </div>
    </div>
  )
}

export default Riding
