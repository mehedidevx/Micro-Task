import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import { FaPlay, FaArrowRight, FaStar, FaCoins, FaTasks, FaUsers } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { AiOutlineDashboard } from "react-icons/ai";
import useAuth from "../../hooks/useAuth";
import slider1 from "../../assets/slider1.jpg";
import slider2 from "../../assets/slider2.jpg";
import slider3 from "../../assets/slider3.jpg";

const slides = [
  {
    image: slider1,
    title: "Welcome to MicroTask",
    description: "Find Quick Gigs & Earn Instantly",
    subtitle: "Complete micro-tasks and earn coins that convert to real money",
    primaryAction: "Start Earning",
    secondaryAction: "Browse Tasks",
    icon: FaCoins,
    gradient: "from-primary via-blue-600 to-secondary",
  },
  {
    image: slider2,
    title: "Hire Skilled Freelancers",
    description: "Connect with Experts Around the World",
    subtitle: "Post tasks and find talented workers ready to help",
    primaryAction: "Post a Task",
    secondaryAction: "Find Workers",
    icon: FaUsers,
    gradient: "from-secondary via-purple-600 to-accent",
  },
  {
    image: slider3,
    title: "Post Your Tasks Easily",
    description: "Get Work Done Fast & Secure",
    subtitle: "Simple posting process with secure payments and quality results",
    primaryAction: "Create Task",
    secondaryAction: "Learn More",
    icon: FaTasks,
    gradient: "from-accent via-green-600 to-primary",
  },
];

const HeroSection = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, value, label, color }) => (
    <div className="bg-base-content/10 backdrop-blur-sm rounded-2xl p-4 border border-base-content/20 hover:bg-base-content/20 transition-all duration-300 hover:scale-105">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full bg-${color}/20 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-base-100">{value}</p>
          <p className="text-sm text-base-100/80">{label}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden">
      {/* Custom Carousel */}
      <div className="relative h-[85vh] lg:h-[90vh]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0' 
                : index < currentSlide 
                  ? 'opacity-0 -translate-x-full' 
                  : 'opacity-0 translate-x-full'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-base-content/70 via-base-content/50 to-base-content/30"></div>
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-30`}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
              <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
                
                {/* Left Content */}
                <div className="text-base-100 space-y-8">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-base-content/10 backdrop-blur-sm px-4 py-2 rounded-full border border-base-content/20 hover:bg-base-content/20 transition-all duration-300">
                    <slide.icon className="w-4 h-4 text-warning animate-pulse" />
                    <span className="text-sm font-medium">Featured Service</span>
                    <HiSparkles className="w-4 h-4 text-warning" />
                  </div>

                  {/* Title */}
                  <div className="space-y-4">
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                      <span className="bg-gradient-to-r from-base-100 via-base-100 to-base-100/80 bg-clip-text text-transparent">
                        {slide.title.split(' ').slice(0, -1).join(' ')}
                      </span>
                      <br />
                      <span className={`bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent animate-pulse`}>
                        {slide.title.split(' ').slice(-1)}
                      </span>
                    </h1>
                    
                    <p className="text-xl lg:text-2xl text-base-100/90 font-medium">
                      {slide.description}
                    </p>
                    
                    <p className="text-lg text-base-100/75 max-w-xl">
                      {slide.subtitle}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to={user ? "/dashboard" : "/register"}
                      className="btn btn-primary btn-lg px-8 hover:btn-secondary rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 group"
                    >
                      <slide.icon className="w-5 h-5 group-hover:animate-bounce" />
                      {slide.primaryAction}
                      <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                    
                    <Link
                      to="/tasks"
                      className="btn btn-outline btn-lg px-8 text-base-100 border-base-100 hover:bg-base-100 hover:text-base-content rounded-full transition-all duration-300 hover:scale-105"
                    >
                      <FaPlay className="w-4 h-4" />
                      {slide.secondaryAction}
                    </Link>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className="w-5 h-5 text-warning" />
                      ))}
                      <span className="ml-2 text-base-100 font-semibold">4.9/5 Rating</span>
                    </div>
                    <div className="text-base-100/80">
                      <span className="font-bold text-base-100">10,000+</span> Happy Users
                    </div>
                  </div>
                </div>

                {/* Right Content - Stats Cards */}
                <div className="hidden lg:block space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <StatCard 
                      icon={FaTasks} 
                      value="5,000+" 
                      label="Tasks Completed" 
                      color="primary" 
                    />
                    <StatCard 
                      icon={FaUsers} 
                      value="2,500+" 
                      label="Active Workers" 
                      color="secondary" 
                    />
                    <StatCard 
                      icon={FaCoins} 
                      value="₹50,000+" 
                      label="Earnings Paid" 
                      color="warning" 
                    />
                  </div>
                  
                  {/* Feature Highlight */}
                  <div className="bg-base-content/10 backdrop-blur-sm rounded-3xl p-6 border border-base-content/20 hover:bg-base-content/20 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <AiOutlineDashboard className="w-6 h-6 text-base-100" />
                      </div>
                      <div>
                        <h3 className="text-base-100 font-bold text-lg">Smart Dashboard</h3>
                        <p className="text-base-100/80 text-sm">Track your progress</p>
                      </div>
                    </div>
                    <p className="text-base-100/70 text-sm">
                      Monitor your earnings, completed tasks, and performance metrics in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-3 bg-base-content/20 backdrop-blur-sm px-4 py-2 rounded-full border border-base-content/20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-primary w-8' 
                  : 'bg-base-100/50 hover:bg-base-100/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slide Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-base-content/20 z-20">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%` 
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 hidden xl:block animate-float">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
      </div>
      <div className="absolute bottom-32 left-10 hidden xl:block animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-warning/20 rounded-full blur-xl"></div>
      </div>
    </section>
  );
};

export default HeroSection;