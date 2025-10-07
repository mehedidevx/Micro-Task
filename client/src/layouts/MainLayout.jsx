import React, { useEffect, useState } from "react";
import Navbar from "../pages/Shared/Navbar/Navbar";
import { Outlet } from "react-router";
import Footer from "../pages/Shared/Footer/Footer";
import Loading from "../components/Loading/Loading";

const MainLayout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 2 seconds
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100">
        <Loading></Loading>
      </div>
    );
  }
  return (
    <div>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default MainLayout;
