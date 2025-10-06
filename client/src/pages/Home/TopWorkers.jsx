import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaCoins, FaCrown, FaTrophy, FaMedal, FaAward, FaUsers, FaTasks, FaFire, FaCheckCircle, FaClock, FaChartLine, FaStar, FaGem, FaShieldAlt, FaRocket, FaHandshake } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import useAxios from "../../hooks/useAxios";

const getRandomRating = () => (Math.random() * 2 + 3).toFixed(1);
const getRandomReviews = () => Math.floor(Math.random() * 150) + 50;
const getRandomCompletedTasks = () => Math.floor(Math.random() * 100) + 20;
const getRandomSuccessRate = () => Math.floor(Math.random() * 15) + 85;
const getRandomStreak = () => Math.floor(Math.random() * 30) + 5;
const getRandomResponseTime = () => (Math.random() * 5 + 1).toFixed(1);
const getRandomSkills = () => {
  const skills = ["Data Entry", "Content Writing", "Graphic Design", "Web Research", "Social Media", "Video Editing", "Translation", "Customer Support"];
  return skills.sort(() => 0.5 - Math.random()).slice(0, 3);
};

const TopWorkers = () => {
  const axios = useAxios();
  const [filterPeriod, setFilterPeriod] = useState("month");

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["topWorkers"],
    queryFn: async () => {
      const res = await axios.get("/users");
      return res.data;
    },
  });

  const topWorkers = users
    .filter((user) => user.role.toLowerCase() === "worker")
    .sort((a, b) => (b.coin || 0) - (a.coin || 0))
    .slice(0, 9);

  // Calculate stats
  const totalEarnings = topWorkers.reduce((sum, worker) => sum + (worker.coin || 0), 0);
  const avgEarnings = topWorkers.length > 0 ? (totalEarnings / topWorkers.length).toFixed(0) : 0;

  if (isLoading) {
    return (
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20  rounded-3xl flex items-center justify-center animate-pulse ">
                <FaUsers className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-base-content">
                Loading Our <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Top Stars</span>
              </h2>
              <p className="text-lg text-base-content/70">Fetching the best performers...</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card bg-base-100 shadow-2xl animate-pulse">
                  <div className="card-body items-center text-center">
                    <div className="w-28 h-28 bg-base-300 rounded-full"></div>
                    <div className="h-5 bg-base-300 rounded w-3/4 mt-6"></div>
                    <div className="h-4 bg-base-300 rounded w-1/2 mt-3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24  rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <svg className="w-12 h-12 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.181 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-base-content mb-4">Unable to Load Workers</h3>
            <p className="text-base-content/70 mb-8">Please check your connection and try again.</p>
            <button onClick={() => window.location.reload()} className="btn bg-[#00bba7] text-white px-8 py-3 rounded-lg hover:bg-transparent hover:text-black transition-all shadow-none border-none">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <FaCrown className="w-7 h-7 text-warning" />;
      case 1: return <FaTrophy className="w-6 h-6 text-orange-500" />;
      case 2: return <FaMedal className="w-6 h-6 text-amber-600" />;
      default: return <FaAward className="w-5 h-5 text-primary" />;
    }
  };

  const getRankBadge = (index) => {
    const badges = [
      { text: "👑 Legend", color: "badge-warning" },
      { text: "🥈 Champion", color: "badge-secondary" },
      { text: "🥉 Master", color: "badge-accent" },
      { text: "⭐ Expert", color: "badge-primary" },
      { text: "💫 Pro", color: "badge-info" },
      { text: "🎯 Elite", color: "badge-success" },
      { text: "⚡ Skilled", color: "badge-primary" },
      { text: "🔥 Rising", color: "badge-error" },
      { text: "✨ Active", color: "badge-neutral" }
    ];
    return badges[index] || { text: "⚡ Worker", color: "badge-ghost" };
  };

  const getCardStyle = (index) => {
    switch (index) {
      case 0: return "ring-4 ring-warning/50 shadow-2xl shadow-warning/30 scale-105 bg-gradient-to-br from-warning/5 to-transparent";
      case 1: return "ring-4 ring-orange-500/50 shadow-2xl shadow-orange-500/25 bg-gradient-to-br from-orange-500/5 to-transparent";
      case 2: return "ring-4 ring-amber-600/50 shadow-2xl shadow-amber-600/25 bg-gradient-to-br from-amber-600/5 to-transparent";
      default: return "shadow-xl hover:shadow-2xl border border-base-300";
    }
  };

  return (
    <section className="py-20 ">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center shadow-2xl">
              <FaCrown className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-base-content mb-4">
            Hall of <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Fame</span>
          </h2>
          <p className="text-lg lg:text-xl text-base-content/70 mb-8 max-w-3xl mx-auto">
            Meet our exceptional performers who are leading the way. These dedicated workers have earned their place through hard work, quality, and consistency.
          </p>
          
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-base-100 px-6 py-3 rounded-full border border-base-content/10">
              <HiSparkles className="w-5 h-5 text-warning animate-spin" />
              <span className="font-bold text-base-content">{topWorkers.length} Top Workers</span>
            </div>
            <div className="flex items-center gap-2 bg-base-100 px-6 py-3 rounded-full border border-base-content/10">
              <FaCoins className="w-5 h-5 text-warning animate-bounce" />
              <span className="font-bold text-base-content">{totalEarnings.toLocaleString()} Total Coins</span>
            </div>
            <div className="flex items-center gap-2 bg-base-100 px-6 py-3 rounded-full border border-base-content/10">
              <FaChartLine className="w-5 h-5 text-success" />
              <span className="font-bold text-base-content">{avgEarnings} Avg Earnings</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-base-100 rounded-full p-2 border border-base-content/10 inline-flex gap-2">
            {["week", "month", "year", "all-time"].map((period) => (
              <button
                key={period}
                onClick={() => setFilterPeriod(period)}
                className={`px-6 py-3 cursor-pointer rounded-full font-semibold capitalize transition-all duration-300 ${
                  filterPeriod === period
                    ? 'bg-[#00bba7] text-white '
                    : 'text-base-content/60 hover:text-base-content hover:bg-base-200'
                }`}
              >
                {period.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Workers Grid */}
        {topWorkers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {topWorkers.map((worker, index) => {
              const rating = getRandomRating();
              const reviewCount = getRandomReviews();
              const completedTasks = getRandomCompletedTasks();
              const successRate = getRandomSuccessRate();
              const streak = getRandomStreak();
              const responseTime = getRandomResponseTime();
              const skills = getRandomSkills();
              const badge = getRankBadge(index);
              
              return (
                <div
                  key={worker._id || worker.email}
                  className={`card bg-base-100 transition-all duration-500 rounded-xl  group cursor-pointer border border-base-content/10`}
                >
                  

                  {/* Streak Badge */}
                  {index < 3 && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <div className="badge badge-error gap-1 px-3 py-3 font-bold shadow-xl animate-pulse">
                        <FaFire className="w-4 h-4" />
                        {streak} days
                      </div>
                    </div>
                  )}

                  <div className="card-body items-center text-center pt-10 pb-6">
                    {/* Profile Photo with Animated Ring */}
                    <div className="relative group/avatar mb-4">
                      <div className="absolute -inset-2 bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-75 group-hover/avatar:opacity-100 animate-spin-slow blur-sm"></div>
                      <div className="relative">
                        <div className="avatar online">
                          <div className="w-28 rounded-full ring-4 ring-base-100 ring-offset-4 ring-offset-base-200 ">
                            <img
                              src={worker.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name || worker.email)}&background=00bba7&color=fff&size=200`}
                              alt={worker.name || worker.email}
                              className="object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                            />
                          </div>
                        </div>
                        
                        {/* Verified Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-base-100 rounded-full p-1">
                          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center shadow-lg">
                            <FaCheckCircle className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Worker Info */}
                    <div className="space-y-2 mb-4">
                      <h3 className="text-xl font-bold text-base-content group-hover:text-primary transition-colors">
                        {worker.name || worker.email.split('@')[0]}
                      </h3>
                      
                      <div className={`${badge.color} badge badge-lg gap-2 font-semibold`}>
                        {badge.text}
                      </div>
                    </div>

                    {/* Main Stats Grid */}
                    <div className="w-full grid grid-cols-2 gap-3 mb-4">
                      {/* Total Coins */}
                      <div className="bg-gradient-to-br from-warning/10 to-orange-500/10 rounded-2xl p-4 border-2 border-warning/30">
                        <div className="flex flex-col items-center gap-1">
                          <FaCoins className="w-6 h-6 text-warning animate-bounce" />
                          <span className="text-2xl font-bold text-warning">
                            {(worker.coin || 0).toLocaleString()}
                          </span>
                          <span className="text-xs text-base-content/60 font-medium">Total Coins</span>
                        </div>
                      </div>

                      {/* Completed Tasks */}
                      <div className="bg-gradient-to-br from-success/10 to-emerald-500/10 rounded-2xl p-4 border-2 border-success/30">
                        <div className="flex flex-col items-center gap-1">
                          <FaCheckCircle className="w-6 h-6 text-success" />
                          <span className="text-2xl font-bold text-success">
                            {completedTasks}
                          </span>
                          <span className="text-xs text-base-content/60 font-medium">Tasks Done</span>
                        </div>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="w-full mb-4">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="badge badge-outline badge-sm font-medium text-base-content/70 hover:bg-primary hover:text-white transition-colors cursor-pointer"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="w-full space-y-2 mb-4">
                      {/* Rating */}
                      <div className="flex items-center justify-between bg-base-200/80 rounded-xl p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <StarRating rating={rating} />
                          <span className="text-sm font-bold text-base-content">{rating}</span>
                        </div>
                        <span className="text-xs text-base-content/60">
                          ({reviewCount} reviews)
                        </span>
                      </div>

                      {/* Success Rate & Response Time */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center justify-between bg-base-200/80 rounded-xl p-2 backdrop-blur-sm">
                          <div className="flex items-center gap-1">
                            <FaChartLine className="w-3 h-3 text-success" />
                            <span className="text-xs font-medium text-base-content">Success</span>
                          </div>
                          <span className="text-xs font-bold text-success">{successRate}%</span>
                        </div>
                        <div className="flex items-center justify-between bg-base-200/80 rounded-xl p-2 backdrop-blur-sm">
                          <div className="flex items-center gap-1">
                            <FaClock className="w-3 h-3 text-info" />
                            <span className="text-xs font-medium text-base-content">Response</span>
                          </div>
                          <span className="text-xs font-bold text-info">{responseTime}h</span>
                        </div>
                      </div>
                    </div>

                    {/* Worker Achievements */}
                    <div className="w-full bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-3 border border-primary/10">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <FaShieldAlt className="w-3 h-3 text-primary" />
                          <span className="font-medium">Verified Worker</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaRocket className="w-3 h-3 text-secondary" />
                          <span className="font-medium">Top {index + 1}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaHandshake className="w-3 h-3 text-accent" />
                          <span className="font-medium">Reliable</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-secondary/0 to-accent/0 group-hover:from-primary/10 group-hover:via-secondary/10 group-hover:to-accent/10 transition-all duration-500 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-base-300/50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <FaUsers className="w-16 h-16 text-base-content/30" />
            </div>
            <h3 className="text-3xl font-bold text-base-content mb-4">No Workers Found</h3>
            <p className="text-lg text-base-content/60 mb-8">Check back later to see our top performers!</p>
          </div>
        )}

        {/* Achievement Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: <FaTasks className="w-8 h-8" />, value: "5,000+", label: "Tasks Completed", color: "from-blue-500 to-cyan-500" },
            { icon: <FaUsers className="w-8 h-8" />, value: "1,200+", label: "Active Workers", color: "from-purple-500 to-pink-500" },
            { icon: <FaGem className="w-8 h-8" />, value: "50k+", label: "Coins Earned", color: "from-orange-500 to-red-500" },
            { icon: <FaClock className="w-8 h-8" />, value: "24/7", label: "Support Available", color: "from-green-500 to-emerald-500" }
          ].map((stat, index) => (
            <div key={index} className="bg-base-100 rounded-3xl p-6 border border-base-content/10  transition-all duration-300  group">
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-base-content mb-2">{stat.value}</div>
              <div className="text-base-content/60 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20">
          <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-10 lg:p-16 border-1 border-primary/10 ">
            <div className="text-center max-w-3xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
                <FaCrown className="w-12 h-12 text-white" />
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-bold text-base-content mb-4">
                Ready to Join the <span className="text-primary">Elite?</span>
              </h3>
              <p className="text-lg text-base-content/70 mb-8 leading-relaxed">
                Complete tasks, earn coins, and climb the leaderboard. Our top workers earn exclusive rewards, badges, and recognition. Start your journey to becoming a legend today!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button className="btn btn-lg  btn-primary px-10 py-4 rounded-lg hover:bg-transparent hover:text-black transition-all  text-lg">
                  <FaTasks className="w-6 h-6" />
                  Start Working Now
                </button>
                <button className="btn btn-secondary btn-lg bg-transparent border border-base-content/10 px-10 py-4 rounded-lg hover:bg-[#00bba8] hover:text-white transition-all shadow-none text-lg">
                  <FaChartLine className="w-6 h-6" />
                  View Leaderboard
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 flex-wrap text-sm">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="w-5 h-5 text-success" />
                  <span className="font-semibold text-base-content">Free to Join</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="w-5 h-5 text-success" />
                  <span className="font-semibold text-base-content">Instant Payouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="w-5 h-5 text-success" />
                  <span className="font-semibold text-base-content">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
        </svg>
      );
    } else if (i === fullStars + 1 && halfStar) {
      stars.push(
        <div key={i} className="relative">
          <svg className="w-4 h-4 text-base-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
          </svg>
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
            </svg>
          </div>
        </div>
      );
    } else {
      stars.push(
        <svg key={i} className="w-4 h-4 text-base-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
        </svg>
      );
    }
  }

  return <div className="flex gap-1">{stars}</div>;
};

export default TopWorkers;