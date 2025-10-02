import React from 'react'
import RidePopUp from './RidePopUp'

const CaptainDetails = () => {
  return (
      <div>
        <div className="h-1/2 p-6 ">
        <div className="flex  items-center justify-between">
          <div className="flex items-center justify-start gap-3 ">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src="https://imgs.search.brave.com/cP7BZHQDcw5dspTfz0QCKKcK9FIig20FfQ8ao2pXwgQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by95b3VuZy1tYW4t/YmxhY2tfNTg0MDkt/MTc5MjUuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw"
              alt=""
            />
            <h4 className="text-lg font-medium ">Ayush jha</h4>
          </div>
          <div>
            <h4 className="text-xl font-semibold ">₹295.2</h4>
            <p className="text-sm font-medium text-gray-600">Earned</p>
          </div>
        </div>
        <div className="flex p-3 mt-6 bg-gray-100 rounded-xl justify-center gap-5 items-start ">
          <div>
            <i class=" text-3xl mb-2  font-extralight ri-time-line"></i>
            <h5 className="text-lg font-medium">10.2</h5>
            <p className="text-sm text-gray-600 ">Hours Online</p>
          </div>
          <div>
            <i class=" text-3xl mb-2  font-extralight ri-speed-up-fill"></i>
            <h5 className="text-lg font-medium">10.2</h5>
            <p className="text-sm text-gray-600 ">Hours Online</p>
          </div>
          <div>
            <i class=" text-3xl mb-2  font-extralight ri-booklet-fill"></i>
            <h5 className="text-lg font-medium">10.2</h5>
            <p className="text-sm text-gray-600 ">Hours Online</p>
          </div>
        </div>
      </div>

      
      </div>

      
  )
}

export default CaptainDetails
