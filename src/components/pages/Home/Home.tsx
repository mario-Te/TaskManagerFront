import React, { useState } from "react";
import SideBar from "../../HomePage/Sidebar/SideBar";
import DisplaySection from "../../HomePage/DisplaySection";
import { logout } from "../../../services/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'tasks' | 'members'|'teams'>('tasks');

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex gap-2">
      <SideBar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex w-full justify-center">
        <DisplaySection activeView={activeView} />
        <button 
          className="absolute right-4 top-4 btn-success bg-dark" 
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default Home;