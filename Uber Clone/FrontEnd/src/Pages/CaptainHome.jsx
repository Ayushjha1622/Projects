import React from "react";
import { Link } from "react-router-dom";

const CaptainHome = () => {
  return (
    <div className="h-screen">
      <div className="fixed p- top-0 flex items-center justify-between w-screen">
        <div className="w-16 ">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
            alt=""
          />
        </div>
        <Link
          to="/home"
          className="  h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i class=" text-lg  font-medium ri-logout-box-line"></i>
        </Link>
      </div>

      <div className="h-1/2">
        <img
          src="https://imgs.search.brave.com/ifLqHkbyqYKdQFVgzrfVEScphGnRTKa16u47GFJL0wY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZHJpYmJibGUuY29t/L3VzZXJ1cGxvYWQv/MjUwMTQzMTkvZmls/ZS9vcmlnaW5hbC05/NGI3ZWIxMzJkZWM4/NTcyNzQ0NzRiYTBh/OWY1YzExNy5wbmc_/Zm9ybWF0PXdlYnAm/cmVzaXplPTQwMHgz/MDAmdmVydGljYWw9/Y2VudGVy"
          alt=""
        />
      </div>

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
  );
};

export default CaptainHome;
