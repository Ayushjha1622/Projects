import React from "react";
import Headers from "../Others/Headers";
import CreateTask from "../Others/CreateTask";
import AllTask from "../Others/AllTask";

const AdminDashboard = () => {
  return (
    <div className="h-screen w-full p-7">
      <Headers />
      <CreateTask/>
      <AllTask/>
    </div>
  );
};

export default AdminDashboard;
