import React from "react";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import { Outlet } from "react-router";
import Testimonial from "./Testimonial";
import FeaturedServices from "./FeaturedServices";

import TopWorkers from "./TopWorkers";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Main Container */}
      <div className="container mx-auto space-y-16 my-16">
        {/*Featured Services */}
        <FeaturedServices />

        {/* How It Works */}
        <HowItWorks />

        {/* Top Workers */}
        <TopWorkers />

        {/* Testimonials */}
        <Testimonial />

        {/* Dynamic Routes or Inner Components */}
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
