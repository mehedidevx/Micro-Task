import React, { useState, useEffect } from 'react';
import { FaPlay, FaArrowRight, FaStar, FaCoins, FaTasks, FaUsers, FaCheckCircle } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { AiOutlineDashboard } from 'react-icons/ai';
import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth';

const slides = [
  {
    title: 'Welcome to MicroTask',
    subtitle: 'Find Quick Gigs & Earn Instantly',
    description: 'Complete micro-tasks and earn coins that convert to real money. Join thousands of workers earning daily.',
    primaryAction: 'Start Earning',
    secondaryAction: 'Browse Tasks',
    icon: FaCoins,
    gradient: 'from-primary to-secondary',
    features: ['No experience needed', 'Get paid instantly', 'Work from anywhere']
  },
  {
    title: 'Hire Skilled Freelancers',
    subtitle: 'Connect with Experts Around the World',
    description: 'Post tasks and find talented workers ready to help. Quality work delivered on time.',
    primaryAction: 'Post a Task',
    secondaryAction: 'Find Workers',
    icon: FaUsers,
    gradient: 'from-secondary to-accent',
    features: ['Verified workers', 'Secure payments', 'Quality guarantee']
  },
  {
    title: 'Post Your Tasks Easily',
    subtitle: 'Get Work Done Fast & Secure',
    description: 'Simple posting process with secure payments and quality results. Track progress in real-time.',
    primaryAction: 'Create Task',
    secondaryAction: 'Learn More',
    icon: FaTasks,
    gradient: 'from-accent to-primary',
    features: ['Easy task creation', 'Real-time tracking', 'Fast delivery']
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, value, label, gradient }) => (
    <div className="bg-base-200 hover:bg-base-300 rounded-2xl p-6 border border-base-300 transition-all duration-300 hover:scale-105 hover:shadow-xl group">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="text-3xl font-bold text-base-content">{value}</p>
          <p className="text-sm text-base-content/60 font-medium">{label}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
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
            <div className="container mx-auto px-4 py-20 lg:py-32 min-h-screen flex items-center">
              <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
                
                {/* Left Content */}
                <div className="space-y-8">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-primary/20 hover:border-primary/40 transition-all duration-300">
                    <slide.icon className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-sm font-semibold text-base-content">Featured Service</span>
                    <HiSparkles className="w-4 h-4 text-warning animate-bounce" />
                  </div>

                  {/* Title */}
                  <div className="space-y-6">
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                      <span className="text-base-content">
                        {slide.title.split(' ').slice(0, -1).join(' ')}
                      </span>
                      <br />
                      <span className={`bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent`}>
                        {slide.title.split(' ').slice(-1)}
                      </span>
                    </h1>
                    
                    <p className="text-2xl lg:text-3xl font-bold text-base-content/80">
                      {slide.subtitle}
                    </p>
                    
                    <p className="text-lg text-base-content/60 max-w-xl leading-relaxed">
                      {slide.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="flex flex-col gap-3">
                    {slide.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                          <FaCheckCircle className="w-4 h-4 text-success" />
                        </div>
                        <span className="text-base-content/80 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link to={user ? "/dashboard" : "/login"}>
                      <button className={`btn btn-lg px-8 bg-gradient-to-r ${slide.gradient} border-none text-white hover:opacity-90 rounded-2xl shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 group`}>
                        <slide.icon className="w-5 h-5 group-hover:animate-bounce" />
                        {slide.primaryAction}
                        <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </Link>
                    
                    <button className="btn btn-lg btn-outline px-8 rounded-2xl transition-all duration-300 hover:scale-105">
                      <FaPlay className="w-4 h-4" />
                      {slide.secondaryAction}
                    </button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-6 border-t border-base-300">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className="w-5 h-5 text-warning" />
                      ))}
                      <span className="ml-2 text-base-content font-semibold">4.9/5 Rating</span>
                    </div>
                    <div className="text-base-content/80">
                      <span className="font-bold text-base-content">10,000+</span> Happy Users
                    </div>
                  </div>
                </div>

                {/* Right Content - Stats & Features */}
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 gap-4">
                    <StatCard 
                      icon={FaTasks} 
                      value="5,000+" 
                      label="Tasks Completed" 
                      gradient="from-primary to-blue-600" 
                    />
                    <StatCard 
                      icon={FaUsers} 
                      value="2,500+" 
                      label="Active Workers" 
                      gradient="from-secondary to-purple-600" 
                    />
                    <StatCard 
                      icon={FaCoins} 
                      value="$50,000+" 
                      label="Earnings Paid" 
                      gradient="from-warning to-orange-600" 
                    />
                  </div>
                  
                  {/* Feature Highlight Card */}
                  <div className="bg-gradient-to-br from-base-200 to-base-200 rounded-3xl p-8 border border-base-300   transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${slide.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <AiOutlineDashboard className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base-content font-bold text-2xl">Smart Dashboard</h3>
                        <p className="text-base-content/60 text-sm">Track your progress</p>
                      </div>
                    </div>
                    <p className="text-base-content/70 leading-relaxed">
                      Monitor your earnings, completed tasks, and performance metrics in real-time with our intuitive dashboard.
                    </p>
                    
                    {/* Mini Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-base-content/10">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">98%</p>
                        <p className="text-xs text-base-content/60">Success Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-secondary">24/7</p>
                        <p className="text-xs text-base-content/60">Support</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-success">Fast</p>
                        <p className="text-xs text-base-content/60">Payments</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-3 bg-base-200 backdrop-blur-lg px-6 py-3 rounded-full border border-base-300 shadow-xl">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-primary w-12 h-3' 
                  : 'bg-base-content/30 hover:bg-base-content/50 w-3 h-3'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-base-300 z-20">
        <div 
          className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-1000 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%` 
          }}
        />
      </div>
    </section>
  );
};

export default HeroSection;