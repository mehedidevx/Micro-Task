import React, { useState } from 'react';
import { FaUserPlus, FaTasks, FaCoins, FaCheckCircle, FaRocket, FaShieldAlt, FaClock, FaStar, FaChartLine, FaHandshake, FaQuestionCircle, FaLightbulb } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('worker');

  const workerSteps = [
    {
      icon: <FaUserPlus className="w-8 h-8" />,
      title: "Sign Up & Create Profile",
      description: "Create your free account in minutes. Complete your profile to showcase your skills and start your earning journey.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      tips: ["Use a clear profile picture", "Add relevant skills", "Complete verification"]
    },
    {
      icon: <FaTasks className="w-8 h-8" />,
      title: "Browse & Select Tasks",
      description: "Explore hundreds of available tasks. Filter by category, payment, and deadline to find tasks that match your skills.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      tips: ["Check task requirements", "Read instructions carefully", "Consider the deadline"]
    },
    {
      icon: <FaCheckCircle className="w-8 h-8" />,
      title: "Complete & Submit",
      description: "Work on your chosen task and submit high-quality results. Follow the guidelines and meet the deadline for approval.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      tips: ["Follow task guidelines", "Submit before deadline", "Ensure quality work"]
    },
    {
      icon: <FaCoins className="w-8 h-8" />,
      title: "Get Paid & Grow",
      description: "Once approved, receive your payment instantly. Build your reputation and unlock higher-paying opportunities.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      tips: ["Withdraw earnings easily", "Build your rating", "Unlock premium tasks"]
    }
  ];

  const employerSteps = [
    {
      icon: <FaUserPlus className="w-8 h-8" />,
      title: "Create Employer Account",
      description: "Sign up as an employer and set up your business profile. Get access to thousands of skilled workers.",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-500/10",
      tips: ["Verify your business", "Add company details", "Set budget limits"]
    },
    {
      icon: <FaTasks className="w-8 h-8" />,
      title: "Post Your Task",
      description: "Create detailed task descriptions with clear requirements, deadlines, and payment amounts. Attract the right workers.",
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-violet-500/10",
      tips: ["Be specific and clear", "Set fair payment", "Add detailed instructions"]
    },
    {
      icon: <FaHandshake className="w-8 h-8" />,
      title: "Review Submissions",
      description: "Receive work submissions from qualified workers. Review and approve quality work that meets your standards.",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      tips: ["Review thoroughly", "Provide feedback", "Approve promptly"]
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: "Scale Your Business",
      description: "Build a network of reliable workers. Post recurring tasks and grow your business efficiently with our platform.",
      color: "from-teal-500 to-green-500",
      bgColor: "bg-teal-500/10",
      tips: ["Build worker relationships", "Post regularly", "Track performance"]
    }
  ];

  const features = [
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "Secure Payments",
      description: "100% secure transactions with escrow protection for both parties",
      color: "text-blue-500"
    },
    {
      icon: <FaClock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support to help you with any issues",
      color: "text-purple-500"
    },
    {
      icon: <FaStar className="w-6 h-6" />,
      title: "Rating System",
      description: "Build your reputation with our transparent rating and review system",
      color: "text-yellow-500"
    },
    {
      icon: <FaRocket className="w-6 h-6" />,
      title: "Quick Approval",
      description: "Fast task approval process to get you paid as soon as possible",
      color: "text-red-500"
    }
  ];

  const faqs = [
    {
      question: "How do I get started?",
      answer: "Simply sign up for a free account, complete your profile, and start browsing tasks. It takes less than 5 minutes!"
    },
    {
      question: "When will I get paid?",
      answer: "You'll receive payment immediately after your task submission is approved by the employer."
    },
    {
      question: "Are there any fees?",
      answer: "Creating an account is free! We only charge a small service fee when you successfully complete and get paid for a task."
    },
    {
      question: "What if I miss a deadline?",
      answer: "Try your best to meet deadlines! Late submissions may affect your rating. Contact support if you have genuine issues."
    }
  ];

  const currentSteps = activeTab === 'worker' ? workerSteps : employerSteps;

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className=" py-5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center  justify-center gap-3 ">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center  animate-pulse">
                <FaLightbulb className="w-8 h-8 text-white" />
              </div>
               <h1 className="text-4xl lg:text-6xl font-bold text-base-content mb-6">
              How It <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Works</span>
            </h1>
            </div>
            
          
            
            <p className="text-lg lg:text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
              Join thousands of people earning daily 
            </p>

            <div className="flex items-center justify-center gap-2 text-warning">
              <HiSparkles className="w-5 h-5 animate-spin" />
              <span className="font-semibold">Simple, Fast & Secure</span>
              <HiSparkles className="w-5 h-5 animate-spin" />
            </div>
          </div>
        </div>
      </section>

      {/* Tab Selection */}
      <section className="py-8 sticky top-0 z-10 bg-base-100 backdrop-blur-lg  border-base-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="bg-base-100 rounded-full p-2  inline-flex">
              <button
                onClick={() => setActiveTab('worker')}
                className={`px-8 cursor-pointer py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === 'worker'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white '
                    : 'text-base-content/60 hover:text-base-content'
                }`}
              >
                I'm a Worker
              </button>
              <button
                onClick={() => setActiveTab('employer')}
                className={`px-8 cursor-pointer py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === 'employer'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'text-base-content/60 hover:text-base-content'
                }`}
              >
                I'm an Employer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {currentSteps.map((step, index) => (
              <div
                key={index}
                className="group bg-base-100 rounded-3xl border border-base-content/10  transition-all duration-500 overflow-hidden hover:-translate-y-2"
              >
                {/* Step Header */}
                <div className={`bg-gradient-to-r ${step.color} p-6 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl text-white">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-white/80 text-sm font-semibold mb-1">
                        Step {index + 1}
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="p-6">
                  <p className="text-base-content/70 text-lg mb-6">
                    {step.description}
                  </p>

                  {/* Tips */}
                  <div className={`${step.bgColor} rounded-2xl p-4`}>
                    <h4 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                      <FaLightbulb className="w-4 h-4 text-warning" />
                      Pro Tips:
                    </h4>
                    <ul className="space-y-2">
                      {step.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm text-base-content/70">
                          <FaCheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA After Steps */}
          <div className="text-center mt-12">
            <button className="btn  btn-primary btn-lg px-12 rounded-full hover:btn-secondary transition-all duration-300 hover:scale-105 ">
              <FaRocket className="w-5 h-5" />
              Get Started Now
            </button>
          </div>
        </div>
      </section>


   

      
    </div>
  );
}