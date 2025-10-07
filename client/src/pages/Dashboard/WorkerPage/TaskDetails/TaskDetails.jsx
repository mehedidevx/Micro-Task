import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  FaUser,
  FaCalendarAlt,
  FaCoins,
  FaUsers,
  FaClipboardCheck,
  FaArrowLeft,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPaperPlane,
  FaInfoCircle,
  FaEye,
  FaStar,
  FaShieldAlt,
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { BiTask } from 'react-icons/bi';
import useAxios from '../../../../hooks/useAxios';
import useAuth from '../../../../hooks/useAuth';

const TaskDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const [submissionDetails, setSubmissionDetails] = useState('');
  const navigate = useNavigate();

  // Fetch task info
  const { data: task, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks/${id}`);
      return res.data;
    },
  });

  // Check if already submitted by this user for this task
  const { data: alreadySubmitted = false } = useQuery({
    queryKey: ['submission-check', id, user?.email],
    enabled: !!user?.email && !!id,
    queryFn: async () => {
      const res = await axiosSecure.get(`/submissions/check?taskId=${id}&email=${user.email}`);
      return res.data.exists;
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (alreadySubmitted) {
      Swal.fire({
        title: 'Already Submitted!',
        text: 'You have already submitted this task.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const submission = {
      task_id: task._id,
      task_title: task.task_title,
      payable_amount: task.payable_amount,
      worker_email: user.email,
      worker_name: user.displayName,
      submission_details: submissionDetails,
      buyer_name: task.buyer_name || "N/A",
      buyer_email: task.buyer_email || "N/A",
      current_date: new Date().toISOString(),
      status: 'pending',
    };

    try {
      const res = await axiosSecure.post('/submissions', submission);
      if (res.data.insertedId) {
        Swal.fire({
          title: 'Success!',
          text: 'Your submission has been sent for review.',
          icon: 'success',
          confirmButtonColor: '#10b981',
        });
        setSubmissionDetails('');
        navigate('/dashboard/mySubmissions');
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error!',
        text: 'Submission failed. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPriorityColor = (amount) => {
    if (amount >= 100) return 'from-red-500 to-pink-500';
    if (amount >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-blue-500';
  };

  const getDaysLeft = (dateString) => {
    const today = new Date();
    const deadline = new Date(dateString);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-base-content/70">Loading task details...</p>
        </div>
      </div>
    );
  }

  const daysLeft = getDaysLeft(task?.completion_date);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/30 to-base-100">
      <div className="container mx-auto px-4 py-8">
        
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/dashboard/taskList')}
          className="btn btn-ghost mb-6 hover:bg-primary/10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
        >
          <FaArrowLeft className="w-4 h-4 mr-2" />
          Back to Tasks
        </motion.button>

        <div className="max-w-5xl mx-auto">
          
          {/* Header Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <BiTask className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Task Details
                </h1>
                <p className="text-base-content/70">
                  Review and submit your work
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Task Details */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              
              {/* Task Image and Basic Info */}
              <div className="bg-gradient-to-br from-base-100 to-base-200/50 backdrop-blur-xl rounded-3xl border border-base-content/10 overflow-hidden">
                {/* Image Section */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    src={task?.task_image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'}
                    alt="Task"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Priority Badge */}
                  <div className="absolute top-6 left-6">
                    <div className={`px-4 py-2 bg-gradient-to-r ${getPriorityColor(task?.payable_amount)} rounded-full shadow-lg`}>
                      <span className="text-white font-bold flex items-center gap-2">
                        <FaStar className="w-4 h-4" />
                        {task?.payable_amount >= 100 ? 'HIGH PRIORITY' : task?.payable_amount >= 50 ? 'MEDIUM' : 'STANDARD'}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-6 right-6">
                    <div className="px-4 py-2 bg-success/90 backdrop-blur-sm rounded-full shadow-lg">
                      <span className="text-white font-bold flex items-center gap-2">
                        <FaCheckCircle className="w-4 h-4" />
                        AVAILABLE
                      </span>
                    </div>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                      {task?.task_title}
                    </h2>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    
                    {/* Buyer Info */}
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <FaUser className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">Task Creator</p>
                        <p className="font-bold text-lg text-base-content">{task?.buyer_name || 'Anonymous'}</p>
                      </div>
                    </div>

                    {/* Deadline Info */}
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-warning/10 to-warning/5 rounded-xl border border-warning/20">
                      <div className="w-12 h-12 bg-gradient-to-r from-warning to-error rounded-full flex items-center justify-center">
                        <FaCalendarAlt className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">Deadline</p>
                        <p className="font-bold text-lg text-base-content">{formatDate(task?.completion_date)}</p>
                        <p className={`text-sm font-medium ${daysLeft > 7 ? 'text-success' : daysLeft > 3 ? 'text-warning' : 'text-error'}`}>
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-base-200/50 rounded-2xl p-6 border border-base-300/20">
                    <h3 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
                      <FaInfoCircle className="w-5 h-5 text-primary" />
                      Task Description
                    </h3>
                    <p className="text-base-content/80 leading-relaxed">
                      {task?.task_detail || "No detailed description provided for this task."}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              
              {/* Task Stats */}
              <div className="bg-gradient-to-br from-base-100 to-base-200/50 backdrop-blur-xl rounded-3xl border border-base-content/10 p-6">
                <h3 className="text-xl font-bold text-base-content mb-6 flex items-center gap-2">
                  <FaShieldAlt className="w-5 h-5 text-primary" />
                  Task Information
                </h3>
                
                <div className="space-y-4">
                  {/* Payment */}
                  <div className="bg-gradient-to-r from-success/10 to-success/5 rounded-xl p-4 border border-success/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaCoins className="w-6 h-6 text-success" />
                        <div>
                          <p className="text-sm text-base-content/60">Reward</p>
                          <p className="font-bold text-xl text-success">{task?.payable_amount}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-base-content/60">Coins</p>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <HiSparkles className="w-6 h-6 text-warning" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Workers Needed */}
                  <div className="bg-gradient-to-r from-info/10 to-info/5 rounded-xl p-4 border border-info/20">
                    <div className="flex items-center gap-3">
                      <FaUsers className="w-6 h-6 text-info" />
                      <div>
                        <p className="text-sm text-base-content/60">Workers Needed</p>
                        <p className="font-bold text-xl text-info">{task?.required_workers}</p>
                      </div>
                    </div>
                  </div>

                  {/* Time Left */}
                  <div className={`bg-gradient-to-r ${daysLeft > 7 ? 'from-success/10 to-success/5' : daysLeft > 3 ? 'from-warning/10 to-warning/5' : 'from-error/10 to-error/5'} rounded-xl p-4 border ${daysLeft > 7 ? 'border-success/20' : daysLeft > 3 ? 'border-warning/20' : 'border-error/20'}`}>
                    <div className="flex items-center gap-3">
                      <FaClock className={`w-6 h-6 ${daysLeft > 7 ? 'text-success' : daysLeft > 3 ? 'text-warning' : 'text-error'}`} />
                      <div>
                        <p className="text-sm text-base-content/60">Time Remaining</p>
                        <p className={`font-bold text-xl ${daysLeft > 7 ? 'text-success' : daysLeft > 3 ? 'text-warning' : 'text-error'}`}>
                          {daysLeft > 0 ? `${daysLeft} days` : 'Overdue'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submission Section */}
              <div className="bg-gradient-to-br from-base-100 to-base-200/50 backdrop-blur-xl rounded-3xl border border-base-content/10 p-6">
                {alreadySubmitted ? (
                  <motion.div
                    className="text-center"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-success to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-success mb-2">Already Submitted!</h3>
                    <p className="text-base-content/70 mb-4">
                      You have already submitted your work for this task.
                    </p>
                    <button
                      onClick={() => navigate('/dashboard/mySubmissions')}
                      className="btn btn-success btn-sm rounded-full"
                    >
                      <FaEye className="w-4 h-4 mr-2" />
                      View Submissions
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaClipboardCheck className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-base-content">Submit Your Work</h3>
                      <p className="text-base-content/70">
                        Describe your completed work in detail
                      </p>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Submission Details</span>
                        <span className="label-text-alt text-error">*Required</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered h-32 rounded-xl bg-base-200/50 border-2 focus:border-primary focus:bg-base-100 transition-all duration-300"
                        required
                        placeholder="Provide detailed information about your completed work, including any relevant links, screenshots, or explanations..."
                        value={submissionDetails}
                        onChange={(e) => setSubmissionDetails(e.target.value)}
                      />
                      <label className="label">
                        <span className="label-text-alt">Minimum 50 characters required</span>
                        <span className="label-text-alt">{submissionDetails.length}/500</span>
                      </label>
                    </div>

                    <motion.button
                      type="submit"
                      className="btn btn-primary w-full rounded-xl shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={submissionDetails.length < 50}
                    >
                      <FaPaperPlane className="w-5 h-5 mr-2" />
                      Submit Work for Review
                    </motion.button>
                  </form>
                )}
              </div>

              {/* Help Section */}
              <div className="bg-gradient-to-r from-info/10 to-info/5 backdrop-blur-xl rounded-2xl p-6 border border-info/20">
                <h4 className="font-bold text-lg text-base-content mb-3 flex items-center gap-2">
                  <FaExclamationTriangle className="w-5 h-5 text-info" />
                  Need Help?
                </h4>
                <p className="text-base-content/70 text-sm mb-4">
                  Having trouble with this task? Contact our support team.
                </p>
                <button className="btn btn-info btn-sm w-full rounded-xl">
                  Get Support
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;