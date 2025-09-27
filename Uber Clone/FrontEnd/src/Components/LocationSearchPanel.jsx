import React from 'react'

const LocationSearchPanel = (props) => {
console.log(props);

  // sample array of locations
  const locations = [ 
    '24B ,Near kapoor cafe , sheryians coding school, bhopal ',
    '22B ,Near Malhotra cafe , sheryians coding school, bhopal ',
    '20B ,Near Sighania cafe , sheryians coding school, bhopal ',
    '18B ,Near Sighania cafe , sheryians coding school, bhopal ',
  ]
  return (
    <div>
      {/* thsi is just a sample data  */}
      {
        locations.map(function(elem,index){
          return (
            <div onClick={()=>{
              props.setVehiclePanel(true)
              props.setPanelOpen(false)
            }}  className='flex items-center justify-start  gap-4  border-2 p-3 border-gray-100 active:border-black rounded-xl  my-2' key={index}>
              <h2 className='bg-[#eee] h-8 flex items-center rounded-full justify-center w-12 '><i className="ri-map-pin-fill"></i></h2>
              <h4 className='font-medium'>{elem}</h4>
            </div>
          )
        })  
        
      }

      <div className='flex items-center justify-start  gap-4  border-2 p-3 border-gray-100 active:border-black rounded-xl  my-4'>
        <h2 className='bg-[#eee] h-8 flex items-center rounded-full justify-center w-12 '><i className="ri-map-pin-fill"></i></h2>
        <h4 className='font-medium'>24B ,Near kapoor cafe , sheryians coding school, bhopal </h4>
      </div>
      <div className='flex items-center justify-start  gap-4  border-2 p-3 border-gray-100 active:border-black rounded-xl  my-2'>
        <h2 className='bg-[#eee] h-8 flex items-center rounded-full justify-center w-12 '><i className="ri-map-pin-fill"></i></h2>
        <h4 className='font-medium'>24B ,Near kapoor cafe , sheryians coding school, bhopal </h4>
      </div>
      <div className='flex items-center justify-start  gap-4  border-2 p-3 border-gray-100 active:border-black rounded-xl  my-2'>
        <h2 className='bg-[#eee] h-8 flex items-center rounded-full justify-center w-12 '><i className="ri-map-pin-fill"></i></h2>
        <h4 className='font-medium'>24B ,Near kapoor cafe , sheryians coding school, bhopal </h4>
      </div>
      <div className='flex items-center justify-start  gap-4  border-2 p-3 border-gray-100 active:border-black rounded-xl  my-2'>
        <h2 className='bg-[#eee] h-8 flex items-center rounded-full justify-center w-12 '><i className="ri-map-pin-fill"></i></h2>
        <h4 className='font-medium'>24B ,Near kapoor cafe , sheryians coding school, bhopal </h4>
      </div>
      <div className='flex items-center justify-start  gap-4  border-2 p-3 border-gray-100 active:border-black rounded-xl  my-2'>
        <h2 className='bg-[#eee] h-8 flex items-center rounded-full justify-center w-12 '><i className="ri-map-pin-fill"></i></h2>
        <h4 className='font-medium'>24B ,Near kapoor cafe , sheryians coding school, bhopal </h4>
      </div>

    </div>
  )
}

export default LocationSearchPanel
