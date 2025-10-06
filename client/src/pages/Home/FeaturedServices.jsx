import React from "react";
import {
  FaPencilAlt,
  FaCode,
  FaPalette,
  FaChartLine,
  FaLanguage,
  FaCamera,
  FaMicrophone,
  FaVideo,
  FaArrowRight,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { Link } from "react-router";

export default function FeaturedServices() {
  const services = [
    {
      id: 1,
      title: "Content Writing",
      description:
        "Professional writing services for blogs, articles, and web content",
      icon: FaPencilAlt,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500",
      tasksAvailable: 245,
      avgPay: 75,
      trending: true,
    },
    {
      id: 2,
      title: "Web Development",
      description:
        "Build responsive websites and web applications with modern technologies",
      icon: FaCode,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500",
      tasksAvailable: 189,
      avgPay: 150,
      trending: true,
    },
    {
      id: 3,
      title: "Graphic Design",
      description: "Create stunning visuals, logos, and branding materials",
      icon: FaPalette,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-500",
      tasksAvailable: 312,
      avgPay: 85,
      trending: false,
    },
    {
      id: 4,
      title: "Digital Marketing",
      description: "SEO, social media management, and marketing strategy",
      icon: FaChartLine,
      color: "from-green-500 to-teal-500",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-500",
      tasksAvailable: 156,
      avgPay: 120,
      trending: true,
    },
    {
      id: 5,
      title: "Translation",
      description: "Accurate translation services for multiple languages",
      icon: FaLanguage,
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-500/10",
      iconColor: "text-indigo-500",
      tasksAvailable: 98,
      avgPay: 65,
      trending: false,
    },
    {
      id: 6,
      title: "Photography",
      description: "Professional photo editing and enhancement services",
      icon: FaCamera,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      iconColor: "text-yellow-500",
      tasksAvailable: 134,
      avgPay: 90,
      trending: false,
    },
    {
      id: 7,
      title: "Voice Over",
      description: "Professional voice recording for videos, ads, and podcasts",
      icon: FaMicrophone,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/10",
      iconColor: "text-pink-500",
      tasksAvailable: 67,
      avgPay: 100,
      trending: false,
    },
    {
      id: 8,
      title: "Video Editing",
      description: "Edit and enhance videos for social media and marketing",
      icon: FaVideo,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-500/10",
      iconColor: "text-red-500",
      tasksAvailable: 178,
      avgPay: 110,
      trending: true,
    },
  ];

  return (
    <section className="min-h-screen  py-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
              <HiSparkles className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-4xl lg:text-5xl font-bold text-base-content">
                Featured{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Services
                </span>
              </h2>
              <p className="text-base-content/70 text-lg">
                Explore our most popular service categories
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-base-content/60">
            <span className="text-sm font-medium">
              {services.reduce((acc, s) => acc + s.tasksAvailable, 0)} active
              tasks across all categories
            </span>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="card bg-base-100 border border-base-content/10  transition-all duration-500  group cursor-pointer relative overflow-hidden"
              >
                {/* Trending Badge */}
                {service.trending && (
                  <div className="absolute  -right-0 z-10">
                    <div className="badge badge-secondary badge-lg font-bold shadow-lg">
                      🔥 Trending
                    </div>
                  </div>
                )}

                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

                <div className="card-body p-6 relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className={`w-8 h-8 ${service.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className="card-title text-base-content text-xl font-bold mb-2">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base-content/70 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-base-content/60">
                        Available Tasks
                      </span>
                      <span className="font-bold text-primary">
                        {service.tasksAvailable}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-base-content/60">Avg. Pay</span>
                      <span className="font-bold text-success">
                        {service.avgPay} coins
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-base-200 rounded-full h-2 mb-4">
                    <div
                      className={`bg-gradient-to-r ${service.color} h-2 rounded-full transition-all duration-500`}
                      style={{
                        width: `${Math.min(
                          (service.tasksAvailable / 312) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  {/* Action Button */}
                  <Link to="/tasks">
                    <button className="btn border-none btn-primary btn-sm rounded-full w-full hover:btn-secondary transition-all duration-300 hover:scale-105">
                      Browse Tasks
                      <FaArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-8 lg:p-12 border border-primary/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-base-content mb-4">
                Can't Find Your Service?
              </h3>
              <p className="text-base-content/70 text-lg mb-6">
                We're constantly adding new categories and services. Browse all
                available tasks or request a custom service category.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/tasks">
                  <button className="btn btn-primary btn-lg px-8 rounded-full   transition-all duration-300 hover:scale-105">
                    View All Tasks
                  </button>
                </Link>
                <button className="btn  btn-secondary   btn-lg px-8    transition-all duration-300 ">
                  Request Service
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-base-100 border border-base-content/10 rounded-2xl p-6 ">
                <div className="text-4xl  font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  1,379+
                </div>
                <div className="text-base-content/70 text-sm">Active Tasks</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 border border-base-content/10 transition-shadow">
                <div className="text-4xl font-bold bg-gradient-to-r from-success to-teal-500 bg-clip-text text-transparent mb-2">
                  95+
                </div>
                <div className="text-base-content/70 text-sm">
                  Avg. Coins/Task
                </div>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 border border-base-content/10 transition-shadow">
                <div className="text-4xl font-bold bg-gradient-to-r from-warning to-orange-500 bg-clip-text text-transparent mb-2">
                  8
                </div>
                <div className="text-base-content/70 text-sm">Categories</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 border border-base-content/10 transition-shadow">
                <div className="text-4xl font-bold bg-gradient-to-r from-secondary to-pink-500 bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <div className="text-base-content/70 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
