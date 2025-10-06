import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaHome,
  FaTasks,
  FaPlus,
  FaUserFriends,
  FaClipboardCheck,
  FaListAlt,
  FaWallet,
  FaMoneyCheckAlt,
  FaCoins,
  FaUser,
  FaChartLine,
  FaCrown,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { BiStats } from "react-icons/bi";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import { useQuery } from "@tanstack/react-query";
import Footer from "../pages/Home/Footer";
import NotificationDropdown from "../components/NotificationDropdown/NotificationDropdown";
import useAxios from "../hooks/useAxios";
import { AiOutlineDashboard } from "react-icons/ai";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const { role, roleLoading } = useUserRole();
  const axios = useAxios();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // fetch all users and get current user from email
  const { data: users = [] } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axios.get("/users");
      return res.data;
    },
    enabled: !!user?.email,
  });

  const currentUser = users.find((u) => u.email === user?.email);
  const coins = currentUser?.coin || 0;

  const getRoleConfig = () => {
    switch (role) {
      case "Worker":
        return {
          gradient: "from-green-500 to-emerald-500",
          icon: FaUser,
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-700"
        };
      case "Buyer":
        return {
          gradient: "from-blue-500 to-cyan-500",
          icon: FaCoins,
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-200 dark:border-blue-700"
        };
      case "Admin":
        return {
          gradient: "from-purple-500 to-pink-500",
          icon: FaCrown,
          bgColor: "bg-purple-50 dark:bg-purple-900/20",
          borderColor: "border-purple-200 dark:border-purple-700"
        };
      default:
        return {
          gradient: "from-gray-500 to-slate-500",
          icon: FaUser,
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          borderColor: "border-gray-200 dark:border-gray-700"
        };
    }
  };

  const roleConfig = getRoleConfig();

  const SidebarLink = ({ to, icon: Icon, children, end = false }) => (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-[1.02] group ${
            isActive
              ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary shadow-lg border border-primary/20"
              : "text-base-content/80 hover:text-primary"
          }`
        }
      >
        <Icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
        <span className="whitespace-nowrap">{children}</span>
      </NavLink>
    </li>
  );

  return (
    <div className="bg-gradient-to-br from-base-100 via-base-200/30 to-base-100 min-h-screen">
      <div className="flex flex-col min-h-screen">
        
        {/* Enhanced Navbar */}
        <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-xl border-b border-base-300/50 ">
          <div className="container mx-auto px-2">
            <nav className="flex  items-center justify-between h-20">
              
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <label
                  htmlFor="dashboard-drawer"
                  className="btn btn-ghost btn-circle lg:hidden hover:bg-primary/10"
                >
                  <FaBars className="w-5 h-5" />
                </label>
                
                <Link 
                  to="/" 
                  className="flex items-center gap-3 group hover:scale-105 transition-all duration-300"
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <HiSparkles className="w-7 h-7 text-white animate-pulse" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-warning rounded-full animate-ping opacity-75"></div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      MicroTask
                    </h1>
                    <p className="text-xs text-base-content/60 font-medium">
                      Dashboard
                    </p>
                  </div>
                </Link>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-4">
                
                {/* Role & Coins Display */}
                <div className="hidden sm:flex items-center gap-3">
                  {/* Role Badge */}
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${roleConfig.borderColor} ${roleConfig.bgColor} backdrop-blur-sm`}>
                    <div className={`w-8 h-8 bg-gradient-to-r ${roleConfig.gradient} rounded-full flex items-center justify-center`}>
                      <roleConfig.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-sm capitalize">{role}</span>
                  </div>
                  
                  {/* Coins Display */}
                  <div className="flex items-center gap-2 bg-gradient-to-r from-warning/20 via-warning/15 to-warning/20 hover:from-warning/30 hover:to-warning/25 px-4 py-2 rounded-full border border-warning/30 hover:border-warning/50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <FaCoins className="w-5 h-5 text-warning animate-bounce" />
                    <span className="font-bold text-warning text-lg">
                      {coins.toLocaleString()}
                    </span>
                    <span className="text-xs text-warning/70 hidden md:inline">
                      coins
                    </span>
                  </div>
                </div>

                {/* Notification */}
                <NotificationDropdown />

                {/* Profile Dropdown */}
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar hover:scale-110 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="w-12 h-10 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100 hover:ring-primary hover:ring-offset-4 transition-all duration-300">
                      <img
                        src={user?.photoURL || "/avatar.png"}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </label>
                  
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-0 shadow-2xl bg-base-100/95 backdrop-blur-xl rounded-3xl w-80 border border-base-300/50 mt-4 overflow-hidden"
                  >
                    {/* Profile Header */}
                    <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-6 border-b border-base-300/30">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full ring-3 ring-primary/30">
                          <img
                            src={user?.photoURL || "/avatar.png"}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-base-content">
                            {user?.displayName || "User"}
                          </h3>
                          <p className="text-sm text-base-content/60 truncate">
                            {user?.email}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className={`w-6 h-6 bg-gradient-to-r ${roleConfig.gradient} rounded-full flex items-center justify-center`}>
                              <roleConfig.icon className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-semibold capitalize">{role}</span>
                            <div className="flex items-center gap-1 ml-2">
                              <FaCoins className="w-3 h-3 text-warning" />
                              <span className="text-sm font-semibold text-warning">
                                {coins.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-3 space-y-1">
                      <li>
                        <NavLink
                          to="/dashboard/myProfile"
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:shadow-md ${
                              isActive ? 'bg-primary/20 text-primary' : 'text-base-content/80'
                            }`
                          }
                        >
                          <FaUser className="w-4 h-4" />
                          <span>My Profile</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/dashboard"
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:shadow-md ${
                              isActive ? 'bg-primary/20 text-primary' : 'text-base-content/80'
                            }`
                          }
                        >
                          <AiOutlineDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </NavLink>
                      </li>
                      <div className="divider my-2"></div>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium w-full text-left transition-all duration-300 hover:bg-error/10 hover:text-error hover:shadow-md text-base-content/80"
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </li>
                    </div>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="drawer flex-1 lg:drawer-open">
          <input
            id="dashboard-drawer"
            type="checkbox"
            className="drawer-toggle"
          />
          
          {/* Main Content */}
          <div className="drawer-content flex flex-col">
            <main className="flex-1 p-6 lg:p-8 bg-gradient-to-br from-base-100/50 to-base-200/30">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </main>
            
          </div>

          {/* Enhanced Sidebar */}
          <div className="drawer-side z-40">
            <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
            
            <aside className="w-80 min-h-full bg-base-100/95 backdrop-blur-xl border-r border-base-300/50">
              {/* Mobile Role & Coins */}
              <div className="p-4 border-b border-base-300/30 lg:hidden">
                <div className="flex items-center justify-between gap-3">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${roleConfig.borderColor} ${roleConfig.bgColor}`}>
                    <div className={`w-6 h-6 bg-gradient-to-r ${roleConfig.gradient} rounded-full flex items-center justify-center`}>
                      <roleConfig.icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-bold text-sm capitalize">{role}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-gradient-to-r from-warning/20 to-warning/10 px-3 py-2 rounded-full">
                    <FaCoins className="w-4 h-4 text-warning" />
                    <span className="font-bold text-warning text-sm">
                      {coins.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-4 ">
                <ul className="space-y-2 sticky top-0">
                  {/* Dashboard Home */}
                  <SidebarLink to="/dashboard" icon={AiOutlineDashboard} end>
                    Dashboard Home
                  </SidebarLink>

                  {/* Role-based Navigation */}
                  {!roleLoading && role === "Worker" && (
                    <>
                      <div className="divider text-xs text-base-content/60 my-6">Worker Tools</div>
                      <SidebarLink to="/dashboard/taskList" icon={FaTasks}>
                        Available Tasks
                      </SidebarLink>
                      <SidebarLink to="/dashboard/mySubmissions" icon={FaClipboardCheck}>
                        My Submissions
                      </SidebarLink>
                      <SidebarLink to="/dashboard/withdrawals" icon={FaWallet}>
                        Withdrawals
                      </SidebarLink>
                    </>
                  )}

                  {!roleLoading && role === "Buyer" && (
                    <>
                      <div className="divider text-xs text-base-content/60 my-6">Buyer Tools</div>
                      <SidebarLink to="/dashboard/addTask" icon={FaPlus}>
                        Create New Task
                      </SidebarLink>
                      <SidebarLink to="/dashboard/myTasks" icon={FaListAlt}>
                        My Tasks
                      </SidebarLink>
                      <SidebarLink to="/dashboard/purchaseCoin" icon={FaCoins}>
                        Purchase Coins
                      </SidebarLink>
                      <SidebarLink to="/dashboard/paymentHistory" icon={FaMoneyCheckAlt}>
                        Payment History
                      </SidebarLink>
                    </>
                  )}

                  {!roleLoading && role === "Admin" && (
                    <>
                      <div className="divider text-xs text-base-content/60 my-6">Admin Panel</div>
                      <SidebarLink to="/dashboard/manageUsers" icon={FaUserFriends}>
                        Manage Users
                      </SidebarLink>
                      <SidebarLink to="/dashboard/manageTasks" icon={FaTasks}>
                        Manage Tasks
                      </SidebarLink>
                     
                    </>
                  )}

                  {/* Common Links */}
                  <div className="divider text-xs text-base-content/60 my-6">Account</div>
                  <SidebarLink to="/dashboard/myProfile" icon={FaUser}>
                    My Profile
                  </SidebarLink>
                </ul>

                {/* Sidebar Footer */}
                <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
                  <div className="text-center">
                    <h4 className="font-bold text-sm text-base-content mb-2">
                      Need Help?
                    </h4>
                    <p className="text-xs text-base-content/70 mb-3">
                      Contact our support team for assistance
                    </p>
                    <button className="btn btn-primary btn-sm w-full rounded-xl">
                      Get Support
                    </button>
                  </div>
                </div>
              </nav>
            </aside>
          </div>
        </div>
         <Footer />
      </div>
     
    </div>
  );
};

export default DashboardLayout;