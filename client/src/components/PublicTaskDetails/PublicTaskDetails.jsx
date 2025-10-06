import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaCoins, FaUsers, FaClock, FaCalendarAlt, FaStar, FaArrowLeft, FaMapMarkerAlt, FaCheckCircle, FaShare, FaBookmark, FaEye, FaTasks, FaUserCheck } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import useAxios from '../../hooks/useAxios';

const PublicTaskDetails = () => {
  const { id } = useParams();
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
      
      console.log("Task API Response:", res.data); 
      
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
    const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getTaskPriority = (payableAmount) => {
    if (payableAmount >= 100) return { level: "High", color: "badge-error", icon: "🔥" };
    if (payableAmount >= 50) return { level: "Medium", color: "badge-warning", icon: "⚡" };
    return { level: "Low", color: "badge-success", icon: "🌱" };
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-base-100 py-8">
        <div className="container mx-auto px-4">
          {/* Loading Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-base-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-base-300 rounded-2xl mb-6"></div>
                <div className="h-24 bg-base-300 rounded-xl mb-4"></div>
                <div className="h-32 bg-base-300 rounded-xl"></div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-base-300 rounded-xl"></div>
                <div className="h-32 bg-base-300 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !task) {
    return (
      <section className="min-h-screen bg-base-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.181 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-base-content mb-2">Task Not Found</h3>
          <p className="text-base-content/70 mb-6">The task you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/browse-tasks')}
            className="btn btn-primary rounded-full px-8"
          >
            Browse Other Tasks
          </button>
        </div>
      </section>
    );
  }

  const daysLeft = getDaysLeft(task.completion_date);
  const priority = getTaskPriority(task.payable_amount);

  // Default values if data is missing
  const deliverables = task.deliverables || [
    "Complete the task as per requirements",
    "Submit before deadline",
    "Maintain quality standards"
  ];

  const skills_required = task.skills_required || ["General Skills"];

  return (
    <section className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-circle hover:btn-primary transition-all duration-300"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`btn btn-ghost btn-circle ${isBookmarked ? 'text-warning' : ''} hover:scale-110 transition-all duration-300`}
            >
              <FaBookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button className="btn btn-ghost btn-circle hover:btn-primary transition-all duration-300">
              <FaShare className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Task Header */}
            <div className="bg-base-100 rounded-3xl p-6 mb-6 border border-base-content/10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className={`badge ${priority.color} badge-lg font-bold`}>
                  {priority.icon} {priority.level} Priority
                </div>
                {daysLeft <= 3 && daysLeft > 0 && (
                  <div className="badge badge-error badge-lg font-bold animate-pulse">
                    🚨 Urgent - {daysLeft} days left
                  </div>
                )}
                <div className="badge badge-outline badge-lg">
                  {task.category || "General"}
                </div>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-base-content mb-4">
                {task.task_title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-base-content/70">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  <span>{task.location || "Remote"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEye className="w-4 h-4" />
                  <span>{task.views || 0} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUserCheck className="w-4 h-4" />
                  <span>{task.applications || 0} applications</span>
                </div>
              </div>
            </div>

            {/* Task Image */}
            <div className="rounded-3xl overflow-hidden mb-6">
              <img
                src={task.task_image_url || "/default-task.png"}
                alt={task.task_title}
                className="w-full h-64 lg:h-96 object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.target.src = "/default-task.png";
                }}
              />
            </div>

            {/* Tabs */}
            <div className="bg-base-100 rounded-3xl p-6 border border-base-content/10">
              <div className="tabs tabs-boxed bg-base-200 p-1 rounded-xl mb-6">
                <button
                  className={`tab tab-lg flex-1 ${activeTab === 'details' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  <FaTasks className="w-4 h-4 mr-2" />
                  Task Details
                </button>
                <button
                  className={`tab tab-lg flex-1 ${activeTab === 'deliverables' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('deliverables')}
                >
                  <FaCheckCircle className="w-4 h-4 mr-2" />
                  Deliverables
                </button>
                <button
                  className={`tab tab-lg flex-1 ${activeTab === 'skills' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('skills')}
                >
                  <HiSparkles className="w-4 h-4 mr-2" />
                  Skills Required
                </button>
              </div>

              {/* Tab Content */}
              <div className="prose max-w-none">
                {activeTab === 'details' && (
                  <div>
                    <h3 className="text-xl font-bold text-base-content mb-4">About This Task</h3>
                    <p className="text-base-content/80 leading-relaxed">
                      {task.task_detail || "No detailed description available."}
                    </p>
                  </div>
                )}

                {activeTab === 'deliverables' && (
                  <div>
                    <h3 className="text-xl font-bold text-base-content mb-4">Expected Deliverables</h3>
                    <ul className="space-y-3">
                      {deliverables.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <FaCheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-base-content/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div>
                    <h3 className="text-xl font-bold text-base-content mb-4">Required Skills</h3>
                    <div className="flex flex-wrap gap-3">
                      {skills_required.map((skill, index) => (
                        <span
                          key={index}
                          className="badge badge-primary badge-lg font-medium px-4 py-3"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Summary Card */}
            <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 text-white">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <FaCoins className="w-6 h-6 text-warning animate-bounce" />
                  <span className="text-3xl font-bold">{task.payable_amount || 0}</span>
                </div>
                <p className="text-white/80">Total Reward</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaUsers className="w-4 h-4" />
                    Workers Needed
                  </span>
                  <span className="font-bold">{task.required_workers || 1}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt className="w-4 h-4" />
                    Deadline
                  </span>
                  <span className="font-bold">
                    {task.completion_date ? new Date(task.completion_date).toLocaleDateString() : "Not specified"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaClock className="w-4 h-4" />
                    Time Left
                  </span>
                  <span className={`font-bold ${daysLeft <= 3 ? 'text-error' : daysLeft <= 7 ? 'text-warning' : 'text-success'}`}>
                    {task.completion_date ? (daysLeft > 0 ? `${daysLeft} days` : 'Expired') : 'No deadline'}
                  </span>
                </div>
              </div>

              <button className="btn btn-warning btn-lg w-full mt-6 rounded-full border-none hover:scale-105 transition-all duration-300">
                <HiSparkles className="w-5 h-5 mr-2" />
                Apply Now
              </button>
            </div>

            {/* Client Information */}
            <div className="bg-base-100 rounded-3xl p-6 border border-base-content/10">
              <h3 className="text-lg font-bold text-base-content mb-4">About Client</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-base-content/70">Rating</span>
                  <div className="flex items-center gap-2">
                    <FaStar className="w-4 h-4 text-warning" />
                    <span className="font-bold">{task.client_rating || "4.5"}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-base-content/70">Tasks Posted</span>
                  <span className="font-bold">{task.total_tasks_posted || "10+"}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-base-content/70">Success Rate</span>
                  <span className="font-bold text-success">{task.success_rate || "95"}%</span>
                </div>
              </div>

              <button className="btn btn-outline btn-sm w-full mt-4 rounded-full">
                View Client Profile
              </button>
            </div>

            {/* Safety Tips */}
            <div className="bg-base-100 rounded-3xl p-6 border border-base-content/10">
              <h3 className="text-lg font-bold text-base-content mb-4">💡 Safety Tips</h3>
              <ul className="space-y-2 text-sm text-base-content/70">
                <li>• Never pay to apply for a task</li>
                <li>• Communicate through the platform</li>
                <li>• Verify task requirements carefully</li>
                <li>• Report suspicious activities</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Tasks Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-base-content">Similar Tasks</h2>
            <Link to="/tasks" className="text-primary hover:text-secondary transition-colors">
              View All Tasks →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Similar task cards would go here */}
            <div className="card bg-base-100 border border-base-content/10 rounded-2xl p-4 text-center">
              <div className="text-base-content/50">
                <p>More similar tasks will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicTaskDetails;