import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaCoins, FaUsers, FaClock, FaCalendarAlt, FaStar, FaArrowLeft, FaMapMarkerAlt, FaCheckCircle, FaShare, FaBookmark, FaEye, FaTasks, FaUserCheck } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import Loading from '../Loading/Loading';


const PublicTaskDetails = () => {
  const { id } = useParams();
  const {user} = useAuth();
  const navigate = useNavigate();
  const axios = useAxios();
  const [activeTab, setActiveTab] = useState('details');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const {
    data: task,  
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const res = await axios.get(`/tasks/${id}`);
      
    
      
      // Response structure check
      if (res.data) {
        return res.data;
      } else if (res.data?.data) {
        return res.data.data;
      } else {
        throw new Error("Task not found");
      }
    },
    enabled: !!id,
  });

  const getDaysLeft = (date) => {
    if (!date) return null;
    const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getTaskPriority = (payableAmount) => {
    if (payableAmount >= 100) return { level: "High", color: "badge-error", icon: "🔥" };
    if (payableAmount >= 50) return { level: "Medium", color: "badge-warning", icon: "⚡" };
    return { level: "Low", color: "badge-success", icon: "🌱" };
  };

  const handleApplyClick = () => {
    // Check if user is logged in (you'll need to implement your own auth check)
    const isLoggedIn = localStorage.getItem('token') || sessionStorage.getItem('token'); // Adjust based on your auth implementation
    
    if (user || isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-100 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Loading Skeleton */}
         <Loading></Loading>
        </div>
      </section>
    );
  }

  if (isError || !task) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-100 py-20">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-base-100 rounded-3xl p-12 shadow-2xl border border-base-content/5">
            <div className="w-28 h-28 bg-gradient-to-br from-error/30 to-error/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg className="w-14 h-14 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.181 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-base-content mb-4">Task Not Found</h3>
            <p className="text-base-content/60 text-lg mb-8">The task you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={() => navigate('/browse-tasks')}
              className="btn btn-primary btn-lg rounded-full px-10 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Browse Other Tasks
            </button>
          </div>
        </div>
      </section>
    );
  }

  const daysLeft = getDaysLeft(task.completion_date);
  const priority = getTaskPriority(task.payable_amount);
  const isTaskExpired = daysLeft !== null && daysLeft < 0;

  // Default values if data is missing
  const deliverables = task.deliverables || [
    "Complete the task as per requirements",
    "Submit before deadline",
    "Maintain quality standards"
  ];

  const skills_required = task.skills_required || ["General Skills"];

  return (
    <section className="min-h-screen  py-8">
      <div className="container mx-auto px-4 ">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-circle hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`btn btn-ghost btn-circle ${isBookmarked ? 'text-warning bg-warning/10' : 'hover:bg-warning/10 hover:text-warning'} transition-all duration-300 shadow-sm hover:shadow-lg`}
            >
              <FaBookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button className="btn btn-ghost btn-circle hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-sm hover:shadow-lg">
              <FaShare className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - 8 columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Task Header */}
            <div className="bg-base-100 rounded-xl p-8  border border-base-content/10  transition-all duration-300">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className={`badge ${priority.color} badge-lg font-bold shadow-lg`}>
                  {priority.icon} {priority.level} Priority
                </div>
                {daysLeft !== null && daysLeft <= 3 && daysLeft > 0 && (
                  <div className="badge badge-error badge-lg font-bold animate-pulse shadow-lg">
                    🚨 Urgent - {daysLeft} days left
                  </div>
                )}
                {isTaskExpired && (
                  <div className="badge badge-error badge-lg font-bold shadow-lg">
                    ⚰️ Expired
                  </div>
                )}
                <div className="badge badge-outline badge-lg shadow-sm hover:shadow-md transition-shadow">
                  {task.category || "General"}
                </div>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-base-content mb-6 leading-tight">
                {task.task_title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-8 text-base-content/70">
                <div className="flex items-center gap-2 hover:text-primary transition-colors">
                  <FaMapMarkerAlt className="w-5 h-5" />
                  <span className="font-medium">{task.location || "Remote"}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-primary transition-colors">
                  <FaEye className="w-5 h-5" />
                  <span className="font-medium">{task.views || 0} views</span>
                </div>
                <div className="flex items-center gap-2 hover:text-primary transition-colors">
                  <FaUserCheck className="w-5 h-5" />
                  <span className="font-medium">{task.applications || 0} applications</span>
                </div>
              </div>
            </div>

            {/* Task Image */}
            <div className="rounded-xl border border-base-content/10 overflow-hidden  group">
              <img
                src={task.task_image_url || "/default-task.png"}
                alt={task.task_title}
                className="w-full h-72 lg:h-[450px] object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = "/default-task.png";
                }}
              />
            </div>

            {/* Tabs */}
            <div className="bg-base-100 rounded-xl p-8  border border-base-content/10  transition-all duration-300">
              <div className="tabs tabs-boxed bg-base-200/70 p-1.5 rounded-2xl mb-8 shadow-inner">
                <button
                  className={`tab tab-lg flex-1 rounded-xl transition-all duration-300 ${activeTab === 'details' ? 'tab-active ' : 'hover:bg-base-300/50'}`}
                  onClick={() => setActiveTab('details')}
                >
                  <FaTasks className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Task Details</span>
                </button>
               
              </div>

              {/* Tab Content */}
              <div className="prose max-w-none">
                {activeTab === 'details' && (
                  <div className="animate-fadeIn">
                    <h3 className="text-2xl font-bold text-base-content mb-6">About This Task</h3>
                    <p className="text-base-content/70 leading-relaxed text-lg">
                      {task.task_detail || "No detailed description available."}
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Sidebar - 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            {/* Task Summary Card */}
            <div className=" rounded-xl p-8 border border-base-content/10   transition-all duration-300">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <FaCoins className="w-8 h-8 text-warning animate-bounce" />
                  <span className="text-5xl font-bold">{task.payable_amount || 0}</span>
                </div>
                <p className="text-white/90 text-lg font-medium">Total Reward</p>
              </div>

              <div className="space-y-5 mb-8">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                  <span className="flex items-center gap-3">
                    <FaUsers className="w-5 h-5" />
                    <span className="font-medium">Workers Needed</span>
                  </span>
                  <span className="font-bold text-xl">{task.required_workers || 1}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                  <span className="flex items-center gap-3">
                    <FaCalendarAlt className="w-5 h-5" />
                    <span className="font-medium">Deadline</span>
                  </span>
                  <span className="font-bold text-lg">
                    {task.completion_date ? new Date(task.completion_date).toLocaleDateString() : "Not specified"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                  <span className="flex items-center gap-3">
                    <FaClock className="w-5 h-5" />
                    <span className="font-medium">Time Left</span>
                  </span>
                  <span className={`font-bold text-xl ${
                    daysLeft === null ? 'text-info' : 
                    daysLeft <= 0 ? 'text-error' : 
                    daysLeft <= 3 ? 'text-warning' : 
                    daysLeft <= 7 ? 'text-warning' : 'text-success'
                  }`}>
                    {daysLeft === null ? 'No deadline' : 
                     daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                  </span>
                </div>
              </div>

              {/* Apply Button - Only show if task is not expired */}
              {!isTaskExpired && (
                <button 
                  onClick={handleApplyClick}
                  className="btn btn-primary  btn-lg w-full rounded-2xl   transition-all duration-300 shadow-xl hover:shadow-2xl font-bold text-lg"
                >
                  <HiSparkles className="w-6 h-6 mr-2" />
                  Apply Now
                </button>
              )}

              {/* Expired Message */}
              {isTaskExpired && (
                <div className="text-center p-3 bg-error/30 backdrop-blur-sm rounded-xl ">
                  <p className="text-white font-bold text-lg">This task has expired</p>
                 
                </div>
              )}
            </div>

            {/* Safety Tips */}
            <div className="bg-base-100 rounded-xl p-8  border border-base-content/10  transition-all duration-300">
              <h3 className="text-xl font-bold text-base-content mb-6 flex items-center gap-2">
                <span className="text-2xl">💡</span> Safety Tips
              </h3>
              <ul className="space-y-4 text-base-content/70">
                <li className="flex items-start gap-3 p-3 rounded-xl hover:bg-base-200/50 transition-all duration-300">
                  <span className="text-primary font-bold">•</span>
                  <span>Never pay to apply for a task</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl hover:bg-base-200/50 transition-all duration-300">
                  <span className="text-primary font-bold">•</span>
                  <span>Communicate through the platform</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl hover:bg-base-200/50 transition-all duration-300">
                  <span className="text-primary font-bold">•</span>
                  <span>Verify task requirements carefully</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl hover:bg-base-200/50 transition-all duration-300">
                  <span className="text-primary font-bold">•</span>
                  <span>Report suspicious activities</span>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-xl hover:bg-base-200/50 transition-all duration-300">
                  <span className="text-primary font-bold">•</span>
                  <span>Read terms and conditions</span>
                </li>
               
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Tasks Section */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-base-content">Similar Tasks</h2>
            <Link to="/tasks" className="text-primary hover:text-secondary transition-colors font-semibold text-lg flex items-center gap-2 hover:gap-3 ">
              View All Tasks <span>→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Similar task cards would go here */}
            <div className="card bg-base-100 border border-base-content/10 rounded-xl p-8 text-center  transition-all duration-300">
              <div className="text-base-content/40">
                <p className="text-lg">More similar tasks will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicTaskDetails;