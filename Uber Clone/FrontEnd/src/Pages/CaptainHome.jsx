import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import CaptainDetails from "../Components/CaptainDetails";
import RidePopUp from "../Components/RidePopUp"
import ConfirmRidePopup from "../Components/ConfirmRidePopup";

const CaptainHome = () => {

  const [ ridePopupPanel, setRidePopupPanel ] = useState(true)
  const ridePopupPanelRef = useRef(null)
  const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)
  const confirmRidePopupPanelRef = useRef(null)

  useGSAP(function () {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, { transform: "translateY(0%)" })
    } else {
      gsap.to(ridePopupPanelRef.current, { transform: "translateY(100%)" })
    }

    if (confirmRidePopupPanel) {
      gsap.to(confirmRidePopupPanelRef.current, { transform: "translateY(0%)" })
    } else {
      gsap.to(confirmRidePopupPanelRef.current, { transform: "translateY(100%)" })
    }
  }, [ ridePopupPanel, confirmRidePopupPanel ])



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
        <RidePopUp setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} />
     </div>

     <div ref={confirmRidePopupPanelRef} className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-10 pt-12">
        <ConfirmRidePopup setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} />
     </div>


    
    </div>
  );
};

export default CaptainHome;
