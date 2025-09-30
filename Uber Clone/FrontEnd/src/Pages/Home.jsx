import React, { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../Components/LocationSearchPanel";
import VehiclePanel from "../Components/VehiclePanel";
import ConfirmRide from "../Components/ConfirmRide";
import LookingForDriver from "../Components/LookingForDriver";
import WaitingForDriver from "../Components/WaitingForDriver";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef();
  const VehiclePanelRef = useRef(null);
  const vehicleFound = useRef(null);
  const confirmRideRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const [vehiclePanelOpen, setVehiclePanel] = useState(false);
  const [confirmRide, setConfirmRide] = useState(false);
  const [VehicleFound, setVehicleFound] = useState(false);
  const [WaitingForDriver, setwaitindDriver] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, { height: "70%", padding: "20" });
        gsap.to(panelCloseRef.current, { opacity: 1 });
      } else {
        gsap.to(panelRef.current, { height: "0%" });
      }
    },
    [panelOpen, panelCloseRef]
  );

  useGSAP(
    function () {
      if (VehiclePanelRef.current) {
        if (vehiclePanelOpen) {
          gsap.to(VehiclePanelRef.current, {
            transform: "translateY(0%)",
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          gsap.to(VehiclePanelRef.current, {
            transform: "translateY(100%)",
            duration: 0.3,
            ease: "power2.out",
          });
        }
      }
    },
    [vehiclePanelOpen]
  );

  useGSAP(
    function () {
      if (confirmRideRef.current) {
        if (confirmRide) {
          gsap.to(confirmRideRef.current, {
            transform: "translateY(0%)",
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          gsap.to(confirmRideRef.current, {
            transform: "translateY(100%)",
            duration: 0.3,
            ease: "power2.out",
          });
        }
      }
    },
    [confirmRide]
  );

  useGSAP(
    function () {
      if (vehicleFoundRef.current) {
        if (VehicleFound) {
          gsap.to(vehicleFoundRef.current, {
            transform: "translateY(0%)",
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          gsap.to(vehicleFoundRef.current, {
            transform: "translateY(100%)",
            duration: 0.3,
            ease: "power2.out",
          });
        }
      }
    },
    [VehicleFound]
  );

  useGSAP(
    function () {
      if (WaitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0%)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [WaitingForDriver]
  );

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />

      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1931&q=80"
          alt="Map background"
        />
      </div>
      <div className="bg-white flex flex-col justify-end top-0  h-screen absolute  w-full">
        <div className="h-[30%] bg-white p-6 relative ">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className=" opacity-0 absolute right-6 top-6 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-lg font-semibold">Find a Trip </h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute h-16 w-1 top-[40%] left-10 bg-gray-900 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
              }}
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
              }}
              className="bg-[#eee]  py-2 text-base rounded-lg w-full mt-5 px-12"
              type="text"
              placeholder="add a pickup location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
              }}
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
              }}
              className="bg-[#eee]  py-2 text-base rounded-lg w-full mt-3 px-12"
              type="text"
              placeholder="enter your destination"
            />
          </form>
        </div>
        <div ref={panelRef} className=" bg-white h-0 ">
          <LocationSearchPanel
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
          />
        </div>
      </div>

      <div
        ref={VehiclePanelRef}
        className="fixed w-full z-10 bottom-0 bg-white px-3 py-10 pt-14 translate-y-full"
      >
        <VehiclePanel
          setVehiclePanel={setVehiclePanel}
          setConfirmRide={setConfirmRide}
        />
      </div>

      <div
        ref={confirmRideRef}
        className="fixed w-full z-20 bottom-0 bg-white px-3 py-10 pt-14 translate-y-full"
      >
        <ConfirmRide
          setConfirmRide={setConfirmRide}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-30 bottom-0 bg-white px-3 py-10 pt-14 translate-y-full"
      >
        <LookingForDriver
          setVehiclePanel={setVehiclePanel}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setwaitindDriver}
        />
      </div>
      <div ref={waitingForDriverRef} className="fixed w-full z-30 bottom-0 bg-white px-3 py-10 pt-14 translate-y-full">
        <WaitingForDriver 
          setWaitingForDriver={setwaitindDriver}
          setVehicleFound={setVehicleFound}
        />
      </div>
    </div>
  );
};

export default Home;
