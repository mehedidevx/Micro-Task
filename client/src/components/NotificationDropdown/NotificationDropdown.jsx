import React, { useState, useRef, useEffect } from "react";
import { Bell, Coins, Clipboard, AlertCircle } from "lucide-react";

const NotificationDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Worker");
  const bellRef = useRef();

  // Demo data
  const workerNotifications = [
    { id: 1, coin: 50, buyerName: "John Doe", title: "Website Design", read: false },
    { id: 2, coin: 30, buyerName: "Jane Smith", title: "Logo Creation", read: false },
    { id: 3, coin: 75, buyerName: "Mike Wilson", title: "App Development", read: true },
  ];

  const buyerSubmissions = [
    { id: 1, worker_name: "Ahmed Ali", task_title: "Mobile App UI Design" },
    { id: 2, worker_name: "Sara Khan", task_title: "Content Writing" },
  ];

  const adminNotifications = [
    { icon: <Coins size={18} />, message: "New withdrawal request.", type: "info" },
    { icon: <AlertCircle size={18} />, message: "User reported an issue.", type: "warning" }
  ];

  const unreadCount = selectedRole === "Worker" 
    ? workerNotifications.filter(n => !n.read).length 
    : selectedRole === "Buyer" 
    ? buyerSubmissions.length 
    : 2;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={bellRef}>
      {/* Bell Icon with Badge */}
      <button
        className="relative btn btn-ghost btn-circle hover:bg-base-200 transition-all duration-200"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Bell className="w-5 h-5 text-base-content" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-content text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-3 w-80 bg-base-100 shadow-2xl rounded-box z-50 border border-base-300 overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-primary to-secondary border-b border-base-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-base-100">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-base-100/20 backdrop-blur-sm text-base-100 text-xs font-semibold px-3 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {selectedRole === "Worker" && workerNotifications.map((notification, i) => (
              <div
                key={i}
                className={`px-5 py-4 border-b border-base-300 cursor-pointer transition-all duration-200 hover:bg-base-200 ${
                  !notification.read ? "bg-primary/10" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-2 rounded-full ${notification.read ? 'bg-base-300' : 'bg-success/20'}`}>
                    <Coins className={`w-5 h-5 ${notification.read ? 'text-base-content/50' : 'text-success'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm leading-relaxed ${
                      notification.read ? "text-base-content/70" : "text-base-content font-semibold"
                    }`}>
                      You earned <span className="font-bold text-primary">{notification.coin} coins</span> from{" "}
                      <span className="font-medium">{notification.buyerName}</span> for completing{" "}
                      <span className="italic">"{notification.title}"</span>
                    </p>
                    {!notification.read && (
                      <span className="inline-block mt-2 text-xs text-primary font-medium">
                        • New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {selectedRole === "Buyer" && buyerSubmissions.map((submission, i) => (
              <div
                key={i}
                className="px-5 py-4 border-b border-base-300 cursor-pointer transition-all duration-200 hover:bg-base-200"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 rounded-full bg-info/20">
                    <Clipboard className="w-5 h-5 text-info" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-base-content font-medium leading-relaxed">
                      <span className="font-semibold">{submission.worker_name}</span> submitted work on{" "}
                      <span className="italic text-secondary">"{submission.task_title}"</span>
                    </p>
                    <span className="inline-block mt-2 text-xs text-base-content/50">
                      Click to review →
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {selectedRole === "Admin" && adminNotifications.map((notif, i) => (
              <div
                key={i}
                className="px-5 py-4 border-b border-base-300 hover:bg-base-200 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-2 rounded-full ${
                    notif.type === 'warning' ? 'bg-warning/20' : 'bg-info/20'
                  }`}>
                    <span className={notif.type === 'warning' ? 'text-warning' : 'text-info'}>
                      {notif.icon}
                    </span>
                  </div>
                  <p className="text-sm text-base-content leading-relaxed flex-1">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-base-200 border-t border-base-300">
            <button className="btn btn-ghost btn-sm w-full text-primary hover:text-primary-focus">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;