import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaHome,
  FaTasks,
  FaUserFriends,
  FaSignInAlt,
  FaCoins,
  FaUser,
} from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { useNavigate } from "react-router";
import ThemeToggle from "../../../components/Theme/ThemeToggle";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const axios = useAxios();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const handleLogOut = () => {
    logOut()
      .then((result) => {
        queryClient.invalidateQueries({ queryKey: ["userCoins", user?.email] });
        console.log(result);
        navigate("/login");
      })
      .catch((error) => console.log(error));
  };

  // ✅ fetch all users and get current user from email
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

  const NavigationLink = ({ to, icon: Icon, children, className = "" }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-[1.02] ${
          isActive
            ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary shadow-lg border border-primary/20"
            : "text-base-content/80 hover:text-primary"
        } ${className}`
      }
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="whitespace-nowrap">{children}</span>
    </NavLink>
  );

  const menuLinks = (
    <>
      <NavigationLink to="/" icon={FaHome}>
        Home
      </NavigationLink>
      <NavigationLink to="/tasks" icon={FaTasks}>
        Browse Tasks
      </NavigationLink>
      <NavigationLink to="/about" icon={FaUserFriends}>
        About Us
      </NavigationLink>

        <NavigationLink to="/contact" icon={FaUserFriends}>
          Contact
        </NavigationLink>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-xl border-b border-base-300/50 shadow-xl">
      <div className="container mx-auto ">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-3 group hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <HiSparkles className="w-6 h-6 lg:w-7 lg:h-7 text-white animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-warning rounded-full animate-ping opacity-75"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl lg:text-3xl font-bold bg-primary bg-clip-text text-transparent">
                  MicroTask
                </h1>
                <p className="text-xs text-base-content/60 font-medium">
                  Earn & Complete
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {menuLinks}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
              {/* Theme Toggle */}
                <ThemeToggle />
            
            {user ? (
              <>
                {/* Coins Display */}
                <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary/20 via-warning/15 to-primary/20 hover:from-warning/30 hover:to-warning/25 px-3 py-1 rounded-full border border-warning/30 hover:border-warning/50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <FaCoins className="w-5 h-5 text-warning animate-bounce" />
                  <span className="font-bold text-warning text-lg">
                    {coins.toLocaleString()}
                  </span>
                 
                </div>

              

                {/* User Profile Dropdown */}
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar hover:scale-110 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="w-10 h-10  rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100 hover:ring-primary hover:ring-offset-4 transition-all duration-300">
                      <img
                        src={user.photoURL || "/avatar.png"}
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
                            src={user.photoURL || "/avatar.png"}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-base-content">
                            {user.displayName || "User"}
                          </h3>
                          <p className="text-sm text-base-content/60 truncate">
                            {user.email}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <FaCoins className="w-3 h-3 text-warning" />
                            <span className="text-sm font-semibold text-primary">
                              {coins.toLocaleString()}
                             
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-3 space-y-1">
                      <li>
                        <NavigationLink
                          to="/profile"
                          icon={FaUser}
                          className="w-full justify-start"
                        >
                          My Profile
                        </NavigationLink>
                      </li>
                      <li>
                        <NavigationLink
                          to="/dashboard"
                          icon={AiOutlineDashboard}
                          className="w-full justify-start"
                        >
                          Dashboard
                        </NavigationLink>
                      </li>
                      <div className="divider my-2"></div>
                      <li>
                        <button
                          onClick={handleLogOut}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium w-full text-left transition-all duration-300 hover:bg-error/10 hover:text-error hover:shadow-md text-base-content/80"
                        >
                          <FiLogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </li>
                    </div>
                  </ul>
                </div>

                {/* Mobile Menu for Logged In Users */}
                <div className="dropdown dropdown-end lg:hidden">
                  <label tabIndex={0} className="btn btn-ghost btn-circle">
                    <FiMenu className="w-6 h-6" />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-4 shadow-2xl bg-base-100/95 backdrop-blur-xl rounded-3xl w-72 border border-base-300/50 mt-4 space-y-2"
                  >
                    <div className="pb-4 border-b border-base-300/30 mb-2">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-warning/20 to-warning/10 px-3 py-2 rounded-full">
                        <FaCoins className="w-4 h-4 text-warning" />
                        <span className="font-bold text-warning">
                          {coins.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {menuLinks}
                  </ul>
                </div>
              </>
            ) : (
              <>
                {/* Theme Toggle for Non-Users */}
                <ThemeToggle />

                {/* Login Button */}
                <NavLink
                  to="/login"
                  className="btn btn-primary hover:btn-secondary btn-sm lg:btn-md rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaSignInAlt className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="hidden sm:inline ml-2">Login</span>
                </NavLink>

                {/* Mobile Menu for Non-Users */}
                <div className="dropdown dropdown-end lg:hidden">
                  <label tabIndex={0} className="btn btn-ghost btn-circle">
                    <FiMenu className="w-6 h-6" />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-4 shadow-2xl bg-base-100/95 backdrop-blur-xl rounded-3xl w-64 border border-base-300/50 mt-4 space-y-2"
                  >
                    {menuLinks}
                  </ul>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;