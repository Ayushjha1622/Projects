import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import CaptainDetails from "../Components/CaptainDetails";
import RidePopUp from "../Components/RidePopUp"

const CaptainHome = () => {

  const[ridePopupPanel, setRidePopupPanel ] = useState(true)
  const ridePopupPanelRef = useRef(null)

   useGSAP(function () {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanel.current, {
          transform: "translateY(0%)",
        });
      } else {
        gsap.to(ridePopupPanel.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [ridePopupPanel]
  );



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
     <div>
      <CaptainDetails/>
     </div>

     <div ref={ridePopupPanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12">
        <RidePopUp setRidePopupPanel={setRidePopupPanel}/>
     </div>


    
    </div>
  );
};

export default CaptainHome;
