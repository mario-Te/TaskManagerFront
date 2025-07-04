import React from "react";
import { FiSidebar, FiX } from "react-icons/fi";
import { CiBellOn, CiBellOff } from "react-icons/ci";
import { FaPlusCircle } from "react-icons/fa";

interface SideBarProps {
  activeView: 'tasks' | 'members'|'teams';
  setActiveView: (view: 'tasks' | 'members'|'teams') => void;
}

function SideBar({ activeView, setActiveView }: SideBarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={`h-screen w-72 p-2 transition-transform duration-500 ${isSidebarOpen ? "-translate-x-0 bg-[#FCFAF8]" : "-translate-x-52 bg-[white]"}`}>
     <div className="flex items-center justify-between p-4 border-b">
        {isSidebarOpen ? (
          <h2 className="text-xl font-semibold"> Welcome {localStorage.getItem("name")||
          ""}</h2>
        ) : (
          <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          {isSidebarOpen ? <FiX size={20} /> : <FiSidebar size={60} />}
        </button>
      </div>
      <main className="w-full px-2 py-6">
        <nav className="flex flex-col gap-2">
          <div className={`rounded-lg px-2 py-1 hover:bg-[#fef1e5] ${activeView === 'tasks' ? 'bg-[#fef1e5]' : ''}`}>
            <button 
              className="flex items-center gap-2 hover:text-[#DC4C3E] w-full text-left"
              onClick={() => setActiveView('tasks')}
            >
              <FaPlusCircle />
              Tasks
            </button>
          </div>
          <div className={`rounded-lg px-2 py-1 hover:bg-[#fef1e5] ${activeView === 'members' ? 'bg-[#fef1e5]' : ''}`}>
            <button 
              className="flex items-center gap-2 hover:text-[#DC4C3E] w-full text-left"
              onClick={() => setActiveView('members')}
            >
              <FaPlusCircle />
              Members
            </button>
          </div>
          <div className={`rounded-lg px-2 py-1 hover:bg-[#fef1e5] ${activeView === 'teams' ? 'bg-[#fef1e5]' : ''}`}>
            <button 
              className="flex items-center gap-2 hover:text-[#DC4C3E] w-full text-left"
              onClick={() => setActiveView('teams')}
            >
              <FaPlusCircle />
              Team 
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
}

export default SideBar;