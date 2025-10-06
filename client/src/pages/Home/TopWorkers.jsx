import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaCoins, FaCrown, FaTrophy, FaMedal, FaAward, FaUsers, FaTasks } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import useAxios from "../../hooks/useAxios";

const getRandomRating = () => {
  // 3 থেকে 5 এর মধ্যে রেটিং র‍্যান্ডম
  return (Math.random() * 2 + 3).toFixed(1);
};

const getRandomReviews = () => {
  return Math.floor(Math.random() * 150) + 50; // 50-200 reviews
};

const TopWorkers = () => {
  const axios = useAxios();

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
    .slice(0, 6);

  if (isLoading) {
    return (
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center animate-pulse">
                <FaUsers className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-base-content">
                Loading Our <span className="text-primary">Top Performers</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card bg-base-100 shadow-xl animate-pulse">
                  <div className="card-body items-center text-center">
                    <div className="w-24 h-24 bg-base-300 rounded-full"></div>
                    <div className="h-4 bg-base-300 rounded w-3/4 mt-4"></div>
                    <div className="h-3 bg-base-300 rounded w-1/2 mt-2"></div>
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
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.181 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-2">Unable to Load Workers</h3>
            <p className="text-base-content/70">Please check your connection and try again.</p>
          </div>
        </div>
      </section>
    );
  }

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <FaCrown className="w-6 h-6 text-warning" />;
      case 1: return <FaTrophy className="w-5 h-5 text-orange-500" />;
      case 2: return <FaMedal className="w-5 h-5 text-amber-600" />;
      default: return <FaAward className="w-4 h-4 text-primary" />;
    }
  };

  const getRankBadge = (index) => {
    const badges = ["🥇 Champion", "🥈 Expert", "🥉 Master", "⭐ Pro", "💫 Elite", "🎯 Skilled"];
    return badges[index] || "⚡ Worker";
  };

  const getCardStyle = (index) => {
    switch (index) {
      case 0: return "ring-4 ring-warning/50 shadow-2xl shadow-warning/25 scale-105";
      case 1: return "ring-2 ring-orange-500/50 shadow-xl shadow-orange-500/20";
      case 2: return "ring-2 ring-amber-600/50 shadow-xl shadow-amber-600/20";
      default: return "shadow-xl hover:shadow-2xl";
    }
  };

  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <FaUsers className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="text-left">
              <h2 className="text-4xl lg:text-5xl font-bold text-base-content">
                Top <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Performers</span>
              </h2>
              <p className="text-base-content/70 text-lg">Our most successful workers this month</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-base-content/60">
            <HiSparkles className="w-5 h-5 text-warning animate-spin" />
            <span className="text-sm font-medium">Ranked by total earnings and performance</span>
            <HiSparkles className="w-5 h-5 text-warning animate-spin" />
          </div>
        </div>

        {/* Workers Grid */}
        {topWorkers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {topWorkers.map((worker, index) => {
              const rating = getRandomRating();
              const reviewCount = getRandomReviews();
              
              return (
                <div
                  key={worker._id || worker.email}
                  className={`card bg-base-100 transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${getCardStyle(index)}`}
                >
                  {/* Rank Badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`badge badge-lg px-4 py-3 gap-2 font-bold shadow-lg ${
                      index === 0 ? 'badge-warning' : 
                      index === 1 ? 'badge-secondary' : 
                      index === 2 ? 'badge-accent' : 'badge-primary'
                    }`}>
                      {getRankIcon(index)}
                      #{index + 1}
                    </div>
                  </div>

                  <div className="card-body items-center text-center pt-8">
                    {/* Profile Photo with Ring */}
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-75 group-hover:opacity-100 animate-pulse"></div>
                      <div className="relative">
                        <div className="avatar">
                          <div className="w-24 rounded-full ring-4 ring-base-100 ring-offset-4 ring-offset-base-200">
                            <img
                              src={worker.photo || "/default-user.png"}
                              alt={worker.name || worker.email}
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="absolute -bottom-2 -right-2">
                          <div className="w-8 h-8 bg-success rounded-full border-4 border-base-100 flex items-center justify-center">
                            <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Worker Info */}
                    <div className="text-center space-y-2 mt-4">
                      <h3 className="text-xl font-bold text-base-content">
                        {worker.name || worker.email}
                      </h3>
                      
                      <div className="badge badge-outline badge-primary gap-1">
                        {getRankBadge(index)}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="w-full space-y-3 mt-4">
                      {/* Coins */}
                      <div className="flex items-center justify-between bg-base-200/50 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <FaCoins className="w-5 h-5 text-warning animate-bounce" />
                          <span className="font-medium text-base-content">Total Coins</span>
                        </div>
                        <div className="text-lg font-bold text-warning">
                          {(worker.coin || 0).toLocaleString()}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center justify-between bg-base-200/50 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <StarRating rating={rating} />
                          <span className="text-sm font-semibold text-base-content">
                            {rating}
                          </span>
                        </div>
                        <div className="text-sm text-base-content/60">
                          ({reviewCount} reviews)
                        </div>
                      </div>
                    </div>

                  
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-base-300/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUsers className="w-12 h-12 text-base-content/30" />
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-2">No Workers Found</h3>
            <p className="text-base-content/60">Check back later to see our top performers!</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-base-content mb-3">
              Want to Join Our Top Performers?
            </h3>
            <p className="text-base-content/70 mb-6 max-w-2xl mx-auto">
              Complete tasks, earn coins, and climb the leaderboard. Our top workers earn recognition and exclusive rewards!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary btn-lg px-8 rounded-full hover:btn-secondary transition-all duration-300 hover:scale-105">
                <FaTasks className="w-5 h-5" />
                Start Working
              </button>
              <button className="btn btn-outline btn-secondary btn-lg px-8 rounded-full hover:scale-105 transition-all duration-300">
                Learn More
              </button>
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
        <svg
          key={i}
          className="w-4 h-4 text-warning"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
        </svg>
      );
    } else if (i === fullStars + 1 && halfStar) {
      stars.push(
        <div key={i} className="relative">
          <svg
            className="w-4 h-4 text-base-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
          </svg>
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <svg
              className="w-4 h-4 text-warning"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
            </svg>
          </div>
        </div>
      );
    } else {
      stars.push(
        <svg
          key={i}
          className="w-4 h-4 text-base-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
        </svg>
      );
    }
  }

  return <div className="flex gap-1">{stars}</div>;
};

export default TopWorkers;