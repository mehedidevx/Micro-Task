import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaCalendarAlt,
  FaCoins,
  FaUsers,
  FaEye,
  FaFilter,
  FaSearch,
  FaClock,
  FaStar,
  FaTasks,
  FaArrowRight,
  FaCheckCircle,
  FaBan,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import useAxios from '../../../../hooks/useAxios';
import Loading from '../../../../components/Loading/Loading';

const TaskList = () => {
  const axiosSecure = useAxios();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterByAmount, setFilterByAmount] = useState('all');
  const [showExpired, setShowExpired] = useState(true);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['all-tasks'],
    queryFn: async () => {
      const res = await axiosSecure.get('/tasks');
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  // Check if task is expired
  const isTaskExpired = (dateString) => {
    const today = new Date();
    const deadline = new Date(dateString);
    return deadline < today;
  };

  // Get days left
  const getDaysLeft = (dateString) => {
    const today = new Date();
    const deadline = new Date(dateString);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const availableTasks = tasks.filter(task => task.required_workers > 0);

  // Filter and sort logic
  let filteredTasks = availableTasks
    .filter(task => 
      task.task_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.buyer_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(task => {
      if (filterByAmount === 'all') return true;
      if (filterByAmount === 'high') return task.payable_amount >= 100;
      if (filterByAmount === 'medium') return task.payable_amount >= 50 && task.payable_amount < 100;
      if (filterByAmount === 'low') return task.payable_amount < 50;
      return true;
    });

  // Filter expired tasks if needed
  if (!showExpired) {
    filteredTasks = filteredTasks.filter(task => !isTaskExpired(task.completion_date));
  }

  filteredTasks = filteredTasks.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.completion_date) - new Date(a.completion_date);
    if (sortBy === 'oldest') return new Date(a.completion_date) - new Date(b.completion_date);
    if (sortBy === 'highest') return b.payable_amount - a.payable_amount;
    if (sortBy === 'lowest') return a.payable_amount - b.payable_amount;
    return 0;
  });

  const getTaskImage = (index) => {
    const images = [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=400&h=250&fit=crop'
    ];
    return images[index % images.length];
  };

  const getPriorityColor = (amount) => {
    if (amount >= 100) return 'from-red-500 to-pink-500';
    if (amount >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-blue-500';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const expiredCount = availableTasks.filter(task => isTaskExpired(task.completion_date)).length;
  const activeCount = availableTasks.length - expiredCount;

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
              <FaTasks className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Available Tasks
              </h1>
              <p className="text-base-content/70">
                {activeCount} active • {expiredCount} expired
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filter and Search Section */}
        <motion.div
          className="bg-base-100/80 backdrop-blur-xl rounded-3xl p-6 border border-base-content/10 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid md:grid-cols-4 gap-4">
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
                placeholder="Search by title or buyer..."
                className="input input-bordered rounded-xl bg-base-200/50 border-2 focus:border-primary focus:bg-base-100 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FaFilter className="w-4 h-4 text-primary" />
                  Sort By
                </span>
              </label>
              <select
                className="select select-bordered rounded-xl bg-base-200/50 border-2 focus:border-primary focus:bg-base-100 transition-all duration-300"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Pay</option>
                <option value="lowest">Lowest Pay</option>
              </select>
            </div>

            {/* Filter by Amount */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FaCoins className="w-4 h-4 text-primary" />
                  Pay Range
                </span>
              </label>
              <select
                className="select select-bordered rounded-xl bg-base-200/50 border-2 focus:border-primary focus:bg-base-100 transition-all duration-300"
                value={filterByAmount}
                onChange={(e) => setFilterByAmount(e.target.value)}
              >
                <option value="all">All Ranges</option>
                <option value="high">$100+ (High)</option>
                <option value="medium">$50-$99 (Medium)</option>
                <option value="low">Under $50 (Low)</option>
              </select>
            </div>

            {/* Show Expired Toggle */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FaClock className="w-4 h-4 text-primary" />
                  Status Filter
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-base-200/50 border-2 border-base-300 hover:border-primary transition-all">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={showExpired}
                  onChange={(e) => setShowExpired(e.target.checked)}
                />
                <span className="label-text">Show Expired</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-base-300/50 rounded-full flex items-center justify-center">
              <FaTasks className="w-12 h-12 text-base-content/40" />
            </div>
            <h3 className="text-2xl font-bold text-base-content/70 mb-2">No Tasks Found</h3>
            <p className="text-base-content/50">Try adjusting your search or filter criteria</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredTasks.map((task, index) => {
              const taskExpired = isTaskExpired(task.completion_date);
              const daysLeft = getDaysLeft(task.completion_date);
              
              return (
                <motion.div
                  key={task._id}
                  className={`group  backdrop-blur-xl rounded-xl border overflow-hidden transition-all duration-500  ${
                    taskExpired ? 'border-error/30 opacity-75' : 'border-base-content/10'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Task Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={task.task_image_url}
                      alt={task.task_title}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                        taskExpired ? 'grayscale' : ''
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Expired Overlay */}
                    {taskExpired && (
                      <div className="absolute inset-0 bg-error/20 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-error/90 backdrop-blur-sm px-6 py-3 rounded-full">
                          <span className="text-white font-bold text-lg flex items-center gap-2">
                            <FaBan className="w-5 h-5" />
                            EXPIRED
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Priority Badge */}
                    {!taskExpired && (
                      <div className="absolute top-4 left-4">
                        <div className={`px-3 py-1 bg-gradient-to-r ${getPriorityColor(task.payable_amount)} rounded-full`}>
                          <span className="text-white text-xs font-bold flex items-center gap-1">
                            <FaStar className="w-3 h-3" />
                            {task.payable_amount >= 100 ? 'HIGH' : task.payable_amount >= 50 ? 'MED' : 'LOW'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      {taskExpired ? (
                        <div className="px-3 py-1 bg-error/90 backdrop-blur-sm rounded-full">
                          <span className="text-white text-xs font-bold flex items-center gap-1">
                            <FaBan className="w-3 h-3" />
                            Expired
                          </span>
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-success/90 backdrop-blur-sm rounded-full">
                          <span className="text-white text-xs font-bold flex items-center gap-1">
                            <FaCheckCircle className="w-3 h-3" />
                            Available
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Sparkle Effect - Only for active tasks */}
                    {!taskExpired && (
                      <motion.div
                        className="absolute top-6 right-6 text-warning"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <HiSparkles className="w-5 h-5" />
                      </motion.div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Expired Warning Banner */}
                    

                    {/* Title */}
                    <h2 className={`text-xl font-bold mb-3 line-clamp-2 transition-colors duration-300 ${
                      taskExpired ? 'text-base-content/60' : 'text-base-content group-hover:text-primary'
                    }`}>
                      {task.task_title}
                    </h2>

                    {/* Task Info */}
                    <div className="space-y-3 mb-6">
                      {/* Buyer */}
                      <div className="flex items-center gap-3 text-base-content/80">
                        <div className={`w-8 h-8 bg-gradient-to-r rounded-lg flex items-center justify-center ${
                          taskExpired ? 'from-base-300/50 to-base-300/30' : 'from-primary/20 to-secondary/20'
                        }`}>
                          <FaUser className={`w-4 h-4 ${taskExpired ? 'text-base-content/40' : 'text-primary'}`} />
                        </div>
                        <div>
                          <p className="text-xs text-base-content/60">Buyer</p>
                          <p className={`font-semibold ${taskExpired ? 'text-base-content/60' : ''}`}>{task.buyer_name}</p>
                        </div>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center gap-3 text-base-content/80">
                        <div className={`w-8 h-8 bg-gradient-to-r rounded-lg flex items-center justify-center ${
                          taskExpired ? 'from-error/20 to-error/10' : 'from-warning/20 to-error/20'
                        }`}>
                          <FaCalendarAlt className={`w-4 h-4 ${taskExpired ? 'text-error' : 'text-warning'}`} />
                        </div>
                        <div>
                          <p className="text-xs text-base-content/60">Deadline</p>
                          <p className={`font-semibold ${taskExpired ? 'text-error' : ''}`}>
                            {formatDate(task.completion_date)}
                          </p>
                          {!taskExpired && daysLeft <= 7 && (
                            <p className={`text-xs font-medium ${daysLeft <= 3 ? 'text-error' : 'text-warning'}`}>
                              {daysLeft} days left
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Payment & Workers */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className={`bg-gradient-to-r rounded-xl p-3 border ${
                          taskExpired 
                            ? 'from-base-300/30 to-base-300/20 border-base-300/30' 
                            : 'from-success/10 to-success/5 border-success/20'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <FaCoins className={`w-4 h-4 ${taskExpired ? 'text-base-content/40' : 'text-success'}`} />
                            <span className="text-xs text-base-content/60">Payment</span>
                          </div>
                          <p className={`font-bold text-lg ${taskExpired ? 'text-base-content/60' : 'text-success'}`}>
                            ${task.payable_amount}
                          </p>
                        </div>
                        
                        <div className={`bg-gradient-to-r rounded-xl p-3 border ${
                          taskExpired 
                            ? 'from-base-300/30 to-base-300/20 border-base-300/30' 
                            : 'from-info/10 to-info/5 border-info/20'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <FaUsers className={`w-4 h-4 ${taskExpired ? 'text-base-content/40' : 'text-info'}`} />
                            <span className="text-xs text-base-content/60">Needed</span>
                          </div>
                          <p className={`font-bold text-lg ${taskExpired ? 'text-base-content/60' : 'text-info'}`}>
                            {task.required_workers}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link to={`/dashboard/task-details/${task._id}`} className="block">
                      <motion.button
                        className={`w-full btn rounded-xl shadow-lg transition-all duration-300 group/btn ${
                          taskExpired 
                            ? 'btn-ghost border-error/30 text-error hover:bg-error/10' 
                            : 'btn-primary hover:shadow-xl'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaEye className="w-4 h-4" />
                        <span>{taskExpired ? 'View Details' : 'View Details'}</span>
                        <FaArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Stats Footer */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-xl rounded-3xl p-8 border border-primary/20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{availableTasks.length}</div>
              <div className="text-base-content/70">Total Tasks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success mb-2">{activeCount}</div>
              <div className="text-base-content/70">Active Tasks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-error mb-2">{expiredCount}</div>
              <div className="text-base-content/70">Expired Tasks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">
                ${availableTasks.reduce((sum, task) => sum + task.payable_amount, 0)}
              </div>
              <div className="text-base-content/70">Total Rewards</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">
                {availableTasks.reduce((sum, task) => sum + task.required_workers, 0)}
              </div>
              <div className="text-base-content/70">Workers Needed</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TaskList;