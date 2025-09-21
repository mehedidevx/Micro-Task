import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck,
  FaTimes,
  FaEye,
  FaClock,
  FaCoins,
  FaCalendarAlt,
  FaClipboardCheck,
  FaFilter,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaTasks,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { BiTask } from "react-icons/bi";
import useAuth from "../../../../hooks/useAuth";
import useAxios from "../../../../hooks/useAxios";
import Loading from "../../../../components/Loading/Loading";

const MySubmission = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const limit = 8;

  const { data, isLoading } = useQuery({
    queryKey: ["mySubmissions", user?.email, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/submissions?worker_email=${user?.email}&page=${currentPage}&limit=${limit}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const submissions = data?.submissions || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Filter submissions
  const filteredSubmissions = submissions
    .filter(submission => 
      statusFilter === 'all' || submission.status === statusFilter
    )
    .filter(submission =>
      submission.task_title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return {
          color: 'text-success',
          bg: 'bg-success/10',
          border: 'border-success/20',
          icon: FaCheckCircle,
          label: 'Approved'
        };
      case 'rejected':
        return {
          color: 'text-error',
          bg: 'bg-error/10',
          border: 'border-error/20',
          icon: FaTimesCircle,
          label: 'Rejected'
        };
      default:
        return {
          color: 'text-warning',
          bg: 'bg-warning/10',
          border: 'border-warning/20',
          icon: FaHourglassHalf,
          label: 'Pending'
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStats = () => {
    const approved = submissions.filter(s => s.status === 'approved').length;
    const pending = submissions.filter(s => s.status === 'pending').length;
    const rejected = submissions.filter(s => s.status === 'rejected').length;
    const totalEarned = submissions
      .filter(s => s.status === 'approved')
      .reduce((sum, s) => sum + s.payable_amount, 0);

    return { approved, pending, rejected, totalEarned };
  };

  const stats = getStats();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/30 to-base-100">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <FaClipboardCheck className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                My Submissions
              </h1>
              <p className="text-base-content/70">
                Track your work progress and earnings
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-gradient-to-br from-success/20 to-success/10 backdrop-blur-xl rounded-2xl p-6 border border-success/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-success to-emerald-500 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{stats.approved}</p>
                <p className="text-base-content/70 text-sm">Approved</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-warning/20 to-warning/10 backdrop-blur-xl rounded-2xl p-6 border border-warning/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-warning to-orange-500 rounded-xl flex items-center justify-center">
                <FaHourglassHalf className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                <p className="text-base-content/70 text-sm">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-error/20 to-error/10 backdrop-blur-xl rounded-2xl p-6 border border-error/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-error to-red-500 rounded-xl flex items-center justify-center">
                <FaTimesCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-error">{stats.rejected}</p>
                <p className="text-base-content/70 text-sm">Rejected</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-xl rounded-2xl p-6 border border-primary/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <FaCoins className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{stats.totalEarned}</p>
                <p className="text-base-content/70 text-sm">Total Earned</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          className="bg-base-100/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-base-300/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FaSearch className="w-4 h-4 text-primary" />
                  Search Tasks
                </span>
              </label>
              <input
                type="text"
                placeholder="Search by task title..."
                className="input input-bordered rounded-xl bg-base-200/50 border-2 focus:border-primary focus:bg-base-100 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FaFilter className="w-4 h-4 text-primary" />
                  Filter by Status
                </span>
              </label>
              <select
                className="select select-bordered rounded-xl bg-base-200/50 border-2 focus:border-primary focus:bg-base-100 transition-all duration-300"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Submissions List */}
        {filteredSubmissions.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-base-300/50 rounded-full flex items-center justify-center">
              <FaTasks className="w-12 h-12 text-base-content/40" />
            </div>
            <h3 className="text-2xl font-bold text-base-content/70 mb-2">No Submissions Found</h3>
            <p className="text-base-content/50">
              {submissions.length === 0 ? "You haven't submitted any tasks yet." : "Try adjusting your search or filter criteria."}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {filteredSubmissions.map((submission, index) => {
              const statusConfig = getStatusConfig(submission.status);
              
              return (
                <motion.div
                  key={submission._id}
                  className="bg-gradient-to-br from-base-100 to-base-200/50 backdrop-blur-xl rounded-3xl shadow-xl border border-base-300/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="p-6">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-base-content mb-2 line-clamp-2">
                          {submission.task_title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-base-content/60">
                          <FaCalendarAlt className="w-4 h-4" />
                          <span>Submitted on {formatDate(submission.current_date)}</span>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.border} border`}>
                        <statusConfig.icon className={`w-4 h-4 ${statusConfig.color}`} />
                        <span className={`font-semibold text-sm ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-success/10 to-success/5 px-4 py-2 rounded-xl border border-success/20">
                        <FaCoins className="w-4 h-4 text-success" />
                        <span className="font-bold text-success">{submission.payable_amount}</span>
                        <span className="text-xs text-success/70">coins</span>
                      </div>
                      
                      {submission.status === 'approved' && (
                        <motion.div
                          className="flex items-center gap-1 text-success text-sm"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <HiSparkles className="w-4 h-4 animate-pulse" />
                          <span>Earned!</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="w-full btn btn-primary btn-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <FaEye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="flex justify-center items-center gap-4 bg-base-100/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-base-300/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <button
              className="btn btn-circle btn-primary btn-sm hover:scale-110 transition-transform"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-base-content/70">Page</span>
              <span className="font-bold text-primary text-lg">{currentPage}</span>
              <span className="text-base-content/70">of {totalPages}</span>
            </div>
            
            <button
              className="btn btn-circle btn-primary btn-sm hover:scale-110 transition-transform"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selectedSubmission && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
            >
              <motion.div
                className="bg-base-100 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-base-300/20"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-base-content">Submission Details</h3>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="btn btn-circle btn-sm hover:bg-error/10 hover:text-error"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="space-y-6">
                  {/* Task Info */}
                  <div className="bg-base-200/50 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-base-content mb-4">Task Information</h4>
                    <div className="grid gap-4">
                      <div>
                        <span className="text-base-content/60 text-sm">Task Title</span>
                        <p className="font-semibold text-base-content">{selectedSubmission.task_title}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-base-content/60 text-sm">Payment</span>
                          <p className="font-semibold text-success">{selectedSubmission.payable_amount} coins</p>
                        </div>
                        <div>
                          <span className="text-base-content/60 text-sm">Status</span>
                          <div className="flex items-center gap-2 mt-1">
                            {(() => {
                              const config = getStatusConfig(selectedSubmission.status);
                              return (
                                <>
                                  <config.icon className={`w-4 h-4 ${config.color}`} />
                                  <span className={`font-semibold capitalize ${config.color}`}>
                                    {selectedSubmission.status}
                                  </span>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission Details */}
                  <div className="bg-base-200/50 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-base-content mb-4">Your Submission</h4>
                    <div className="space-y-4">
                      <div>
                        <span className="text-base-content/60 text-sm">Submitted On</span>
                        <p className="font-semibold text-base-content">{formatDate(selectedSubmission.current_date)}</p>
                      </div>
                      <div>
                        <span className="text-base-content/60 text-sm">Work Description</span>
                        <p className="text-base-content mt-2 p-4 bg-base-100 rounded-xl border border-base-300/20">
                          {selectedSubmission.submission_details || selectedSubmission.description || "No description provided"}
                        </p>
                      </div>
                      {selectedSubmission.submission_link && (
                        <div>
                          <span className="text-base-content/60 text-sm">Evidence Link</span>
                          <a
                            href={selectedSubmission.submission_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold mt-2 transition-colors"
                          >
                            <FaExternalLinkAlt className="w-4 h-4" />
                            View Submission Link
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MySubmission;