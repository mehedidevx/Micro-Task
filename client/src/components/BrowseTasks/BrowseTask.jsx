import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaCoins, FaUsers, FaClock, FaSearch, FaFilter, FaEye, FaCalendarAlt, FaTasks, FaStar } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { Link } from "react-router-dom";
import useAxios from "../../hooks/useAxios";

const BrowseTask = () => {
  const axios = useAxios();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filterBy, setFilterBy] = useState("all");

  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get("/tasks");
      return res.data;
    },
  });

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter(task => 
      task.task_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.task_detail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by category
    if (filterBy !== "all") {
      filtered = filtered.filter(task => task.category === filterBy);
    }

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "highest_pay":
          return (b.payable_amount || 0) - (a.payable_amount || 0);
        case "lowest_pay":
          return (a.payable_amount || 0) - (b.payable_amount || 0);
        case "deadline":
          return new Date(a.completion_date) - new Date(b.completion_date);
        case "workers_needed":
          return (b.required_workers || 0) - (a.required_workers || 0);
        default: // latest
          return new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id);
      }
    });

    return filtered;
  }, [tasks, searchTerm, sortBy, filterBy]);

  const getRandomRating = () => (Math.random() * 2 + 3).toFixed(1);
  const getTaskPriority = (payableAmount) => {
    if (payableAmount >= 100) return { level: "High", color: "badge-error", icon: "🔥" };
    if (payableAmount >= 50) return { level: "Medium", color: "badge-warning", icon: "⚡" };
    return { level: "Low", color: "badge-success", icon: "🌱" };
  };

  const getDaysLeft = (date) => {
    const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-base-200 py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center animate-pulse">
                <FaTasks className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-base-content">
                  Loading <span className="text-primary">Tasks</span>
                </h1>
                <p className="text-base-content/70">Please wait while we fetch available tasks...</p>
              </div>
            </div>
          </div>

          {/* Loading Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="card bg-base-100 shadow-xl animate-pulse">
                <div className="h-48 bg-base-300 rounded-t-2xl"></div>
                <div className="card-body">
                  <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-base-300 rounded w-full mb-2"></div>
                  <div className="h-3 bg-base-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="min-h-screen bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.181 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-2">Failed to Load Tasks</h3>
            <p className="text-base-content/70 mb-6">Please check your connection and try again.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary rounded-full px-8"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-base-200 py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <FaTasks className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-base-content">
                Browse <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Tasks</span>
              </h1>
              <p className="text-base-content/70 text-lg">Find the perfect task and start earning today</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-base-content/60">
            <HiSparkles className="w-5 h-5 text-warning animate-spin" />
            <span className="text-sm font-medium">{filteredTasks.length} tasks available</span>
            <HiSparkles className="w-5 h-5 text-warning animate-spin" />
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-base-100 rounded-3xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-12 rounded-full focus:input-primary"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select select-bordered w-full rounded-full focus:select-primary"
              >
                <option value="latest">Latest First</option>
                <option value="highest_pay">Highest Pay</option>
                <option value="lowest_pay">Lowest Pay</option>
                <option value="deadline">Deadline</option>
                <option value="workers_needed">Most Workers Needed</option>
              </select>
            </div>

            {/* Filter */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="select select-bordered w-full pl-12 rounded-full focus:select-primary"
              >
                <option value="all">All Categories</option>
                <option value="data-entry">Data Entry</option>
                <option value="writing">Content Writing</option>
                <option value="design">Design</option>
                <option value="research">Research</option>
                <option value="translation">Translation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTasks.map((task) => {
              const priority = getTaskPriority(task.payable_amount);
              const daysLeft = getDaysLeft(task.completion_date);
              const rating = getRandomRating();

              return (
                <div
                  key={task._id}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group cursor-pointer"
                >
                  {/* Priority Badge */}
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className={`badge ${priority.color} badge-lg font-bold shadow-lg`}>
                      {priority.icon} {priority.level}
                    </div>
                  </div>

                  {/* Urgency Badge */}
                  {daysLeft <= 3 && daysLeft > 0 && (
                    <div className="absolute -top-3 -left-3 z-10">
                      <div className="badge badge-error badge-lg font-bold shadow-lg animate-pulse">
                        🚨 Urgent
                      </div>
                    </div>
                  )}

                  {/* Image */}
                  <figure className="h-48 overflow-hidden rounded-t-2xl">
                    <img
                      src={task.task_image_url || "/default-task.png"}
                      alt={task.task_title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </figure>

                  <div className="card-body p-5">
                    {/* Title */}
                    <h3 className="card-title text-base-content text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {task.task_title}
                    </h3>

                    {/* Description */}
                    <p className="text-base-content/70 text-sm mb-4 line-clamp-3">
                      {task.task_detail}
                    </p>

                    {/* Stats */}
                    <div className="space-y-3 mb-4">
                      {/* Pay and Workers */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                          <FaCoins className="w-4 h-4 text-warning animate-bounce" />
                          <span className="font-bold text-primary text-sm">
                            {task.payable_amount} coins
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-full">
                          <FaUsers className="w-4 h-4 text-secondary" />
                          <span className="font-semibold text-secondary text-sm">
                            {task.required_workers} needed
                          </span>
                        </div>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center justify-between bg-base-200/50 p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium text-base-content">Deadline</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-base-content">
                            {new Date(task.completion_date).toLocaleDateString()}
                          </p>
                          <p className={`text-xs ${daysLeft <= 3 ? 'text-error' : daysLeft <= 7 ? 'text-warning' : 'text-success'}`}>
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <FaStar className="w-4 h-4 text-warning" />
                          <span className="text-sm font-semibold text-base-content">{rating}</span>
                        </div>
                        <span className="text-xs text-base-content/60">
                          Client Rating
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="card-actions justify-end">
                      <Link 
                        to={`/task-details/${task._id}`}
                        className="btn btn-primary btn-sm rounded-full px-6 hover:btn-secondary transition-all duration-300 hover:scale-105"
                      >
                        <FaEye className="w-4 h-4" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-base-300/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaSearch className="w-12 h-12 text-base-content/30" />
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-2">No Tasks Found</h3>
            <p className="text-base-content/60 mb-6">
              {searchTerm ? 'Try different search terms or filters' : 'Check back later for new tasks!'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => {setSearchTerm(''); setFilterBy('all');}}
                className="btn btn-primary rounded-full px-8"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Load More Section (if needed) */}
        {filteredTasks.length > 0 && (
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold text-base-content mb-3">
                Found the Perfect Task?
              </h3>
              <p className="text-base-content/70 mb-6 max-w-2xl mx-auto">
                Join thousands of workers who are earning daily. Complete tasks, build your reputation, and grow your income!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn btn-primary btn-lg px-8 rounded-full hover:btn-secondary transition-all duration-300 hover:scale-105">
                  <FaUsers className="w-5 h-5" />
                  Join Now
                </Link>
                <Link to="/how-it-works" className="btn btn-outline btn-lg px-8 rounded-full hover:scale-105 transition-all duration-300">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BrowseTask;