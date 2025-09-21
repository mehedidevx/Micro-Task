import React from "react";
import { motion } from "framer-motion";
import { 
  FaRocket, 
  FaUsers, 
  FaCoins, 
  FaShieldAlt, 
  FaLightbulb, 
  FaHandshake,
  FaTasks,
  FaChartLine,
  FaGlobe,
  FaStar
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const About = () => {
  const features = [
    {
      icon: FaCoins,
      title: "Coin-Based System",
      description: "Earn and spend coins in our secure digital economy",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: FaShieldAlt,
      title: "Secure Payments",
      description: "Protected transactions with instant coin transfers",
      gradient: "from-green-400 to-blue-500"
    },
    {
      icon: FaTasks,
      title: "Diverse Tasks",
      description: "From simple data entry to creative projects",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: FaChartLine,
      title: "Real-time Analytics",
      description: "Track your progress and earnings instantly",
      gradient: "from-blue-400 to-cyan-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users", icon: FaUsers },
    { number: "50K+", label: "Tasks Completed", icon: FaTasks },
    { number: "1M+", label: "Coins Earned", icon: FaCoins },
    { number: "99%", label: "Satisfaction Rate", icon: FaStar }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/30 to-base-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Hero Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative inline-block mb-6">
            <motion.div
              className="w-24 h-24 mx-auto bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <HiSparkles className="w-12 h-12 text-white" />
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <FaRocket className="w-4 h-4 text-white" />
            </motion.div>
          </div>
          
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            About MicroTask
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-base-content/70 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Where innovation meets opportunity in the world of micro-freelancing
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="grid lg:grid-cols-2 gap-16 items-center mb-20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              className="bg-gradient-to-br from-base-100 to-base-200/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-base-300/20"
              whileHover={{ y: -5, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                className="text-lg leading-relaxed text-base-content/80 mb-6"
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                Welcome to our revolutionary freelance micro-task marketplace, where 
                <span className="text-primary font-semibold"> innovation meets opportunity</span>. 
                We connect passionate workers with task providers in a secure, fast, and rewarding platform.
              </motion.p>

              <motion.p
                className="text-lg leading-relaxed text-base-content/80 mb-6"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                Whether you're a business looking to outsource tasks or a freelancer 
                wanting to <span className="text-secondary font-semibold">earn coins</span> by 
                completing small jobs — our platform is designed for you.
              </motion.p>

              <motion.p
                className="text-lg leading-relaxed text-base-content/80"
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                With our coin-based system, real-time updates, secure payments, and 
                personalized dashboards, managing your tasks and earnings has never been easier.
              </motion.p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-xl rounded-2xl p-6 border border-primary/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <FaHandshake className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold text-primary">Join Our Community</h3>
              </div>
              <p className="text-base-content/80 text-lg font-medium">
                Take control of your freelance journey and be part of the future of work!
              </p>
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="relative bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-xl rounded-3xl p-8 border border-base-300/20">
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-base-100/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.05 }}
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-sm text-base-content mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-base-content/60">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
              
              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-warning to-error rounded-full opacity-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-r from-info to-success rounded-full opacity-30"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="bg-gradient-to-r from-base-100 to-base-200/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-base-300/20 mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <motion.h3
            className="text-3xl font-bold text-center mb-12 text-base-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            Platform Statistics
          </motion.h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-base-content/70 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2.4 }}
        >
          <motion.div
            className="bg-gradient-to-r from-primary via-secondary to-accent p-8 rounded-3xl shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <FaGlobe className="w-16 h-16 mx-auto mb-6 text-white animate-pulse" />
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of freelancers and businesses who are already earning and growing with MicroTask
            </p>
            <motion.button
              className="btn btn-lg bg-white text-primary hover:bg-base-200 border-none shadow-lg px-12 rounded-full font-bold text-lg"
              whileHover={{ scale: 1.05, shadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;