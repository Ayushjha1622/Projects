import React from 'react'

const LookingForDriver = (props) => {
  return (
     <div>
      <h5
        onClick={() => {
          props.setVehicleFound(false);
        }}
        className="p-3 text-center w-[93%] absolute top-0 "
      >
        {" "}
        <i class="ri-arrow-down-wide-line text-3xl text-gray-400"></i>
      </h5>
      <h3 className="text-lg font-semibold  mb-5">Looking For a Driver </h3>
      <div className="flex items-center justify-between flex-col gap-2 p-3 border-b-2">
        <img
          className="h-20"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt=""
        />

        <div className="w-full mt-5">
          <div className="flex items-center gap-2 p-3 border-b-2">
            <i className="ri-map-pin-user-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                Kankariya Talab, Bhopal
              </p>
            </div>
          </div>
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

      
      </div>
    </div>
  )
}

export default LookingForDriver
