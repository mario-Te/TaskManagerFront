import React, { useEffect, useState, useCallback } from "react";
import { FiSidebar } from "react-icons/fi";
import { CiBellOn, CiBellOff } from "react-icons/ci";
import { FaPlusCircle } from "react-icons/fa";
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markNotificationAsRead, socketNotificationReceived } from "../../../redux/notificationSlice";
import { AppDispatch, RootState } from "../../../redux/store";


const socket = io('https://taskmanagerback-0bu3.onrender.com',{
  withCredentials:true,
  transports: ['websocket', 'polling']
});

function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount, loading } = useSelector((state: RootState) => state.notifications);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleMarkAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    for (const notification of unreadNotifications) {
      try {
        await dispatch(markNotificationAsRead(notification._id)).unwrap();
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  }, [dispatch, notifications]);

  const toggleNotificationDropdown = useCallback(async () => {
    const willOpen = !isDropDownOpen;
    setIsDropDownOpen(willOpen);
    
    if (willOpen && unreadCount > 0) {
      await handleMarkAsRead();
    }
  }, [isDropDownOpen, unreadCount, handleMarkAsRead]);

  useEffect(() => {
    socket.on('connect', () => console.log('Connected to server'));
    socket.on('new-notification', (notification) => {
      console.log(notification)
      dispatch(socketNotificationReceived(notification));
    });
    
    dispatch(fetchNotifications());

    return () => {
      socket.off('connect');
      socket.off('new-notification');
    };
  }, [dispatch]);

  return (
    <div className={`h-screen w-72 p-2 transition-transform duration-500 ${isSidebarOpen ? "-translate-x-0 bg-[#FCFAF8]" : "-translate-x-52 bg-[white]"}`}>
      <header className="flex items-center justify-between text-lg">
        <div className="flex items-center justify-center gap-2 hover:bg-gray-100">
          {/* Header content */}
        </div>

        <div className="icons flex justify-center gap-2">
          <div className="relative">
            <button onClick={toggleNotificationDropdown} className="relative p-1 hover:bg-gray-100 rounded-full">
              {unreadCount > 0 ? (
                <CiBellOn className="h-6 w-6 text-blue-500" />
              ) : (
                <CiBellOff className="h-6 w-6" />
              )}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {isDropDownOpen && (
              <div className="absolute -right-22 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                </div>
                {loading ? (
                  <div className="px-4 py-4 text-center">
                    <p className="text-sm text-gray-500">Loading...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.map(notification => (
                      <div key={notification._id} className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                        <p className="text-ls text-bold">{notification.title}</p>
                        <p className="text-sm text-gray-800">{notification.description}</p>
                      
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-4 text-center">
                    <p className="text-sm text-gray-500">No notifications yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button onClick={toggleSidebar} className="p-1 hover:bg-[#EFECE6] rounded-full">
            <FiSidebar className="h-6 w-6" />
          </button>
        </div>
      </header>
      
      <main className="w-full px-2 py-6">
        <nav className="flex flex-col gap-2">
          <div className="add-task rounded-lg px-2 py-1 hover:bg-[#fef1e5]">
            <button className="flex items-center gap-2 hover:text-[#DC4C3E]">
              <FaPlusCircle />
              Add task
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
}

export default SideBar;