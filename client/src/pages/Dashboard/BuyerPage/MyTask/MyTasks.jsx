import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaCoins,
  FaUsers,
  FaCalendarAlt,
  FaImage,
  FaSpinner,
  FaTasks,
} from "react-icons/fa";
import useAxios from "../../../../hooks/useAxios";
import toast from "react-hot-toast";
import { useState, useMemo } from "react";
import Loading from "../../../../components/Loading/Loading";

const MyTasks = () => {
  const { user } = useAuth();
  const axios = useAxios();
  const queryClient = useQueryClient();

  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    submission_details: "",
  });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["myTasks", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`/tasks?creator_email=${user.email}`);
      return res.data;
    },
  });

  // Calculate stats with useMemo
  const stats = useMemo(() => {
    const totalWorkers = tasks.reduce(
      (sum, task) => sum + (task.required_workers || 0),
      0
    );
    const totalCoins = tasks.reduce(
      (sum, task) => sum + (task.payable_amount * task.required_workers || 0),
      0
    );
    const activeTasks = tasks.filter(
      (task) => new Date(task.completion_date) > new Date()
    ).length;

    return { totalWorkers, totalCoins, activeTasks };
  }, [tasks]);

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      const res = await axios.delete(`/tasks/${taskId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`🪙 ${data.refundAmount} coins refunded & task deleted`);
      queryClient.invalidateQueries(["myTasks"]);
      queryClient.invalidateQueries(["user-coins"]);
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/tasks/${selectedTask._id}`, {
        task_title: formData.title,
        task_detail: formData.description,
        submission_info: formData.submission_details,
      });

      toast.success("Task updated successfully");
      queryClient.invalidateQueries(["myTasks"]);
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.task_title || "",
      description: task.task_detail || "",
      submission_details: task.submission_info || "",
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const closeAllModals = () => {
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedTask(null);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-box p-6 lg:p-8 text-primary-content">
          <div className="flex items-center gap-4">
            <div className="bg-primary-content/20 p-4 rounded-box backdrop-blur-sm">
              <FaTasks className="text-3xl lg:text-4xl text-primary-content" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold mb-2">My Created Tasks</h1>
              <p className="text-primary-content/80 text-sm lg:text-base">
                Manage your tasks and track their progress
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Tasks */}
          <div className="card bg-base-100 border border-base-content/10 hover:border-primary/30 transition-all duration-300 group">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-base-content/70 text-xs sm:text-sm font-medium mb-1 truncate">
                    Total Tasks
                  </p>
                  <h3 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-primary truncate">
                    {tasks.length}
                  </h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-box group-hover:scale-110 transition-transform flex-shrink-0 ml-3">
                  <FaImage className="text-xl sm:text-2xl xl:text-3xl text-primary" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-base-content/10">
                <p className="text-xs sm:text-sm text-base-content/60 truncate">
                  All created tasks
                </p>
              </div>
            </div>
          </div>

          {/* Total Workers */}
          <div className="card bg-base-100 border border-base-content/10 hover:border-secondary/30 transition-all duration-300 group">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-base-content/70 text-xs sm:text-sm font-medium mb-1 truncate">
                    Workers Needed
                  </p>
                  <h3 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-secondary truncate">
                    {stats.totalWorkers}
                  </h3>
                </div>
                <div className="bg-secondary/10 p-3 rounded-box group-hover:scale-110 transition-transform flex-shrink-0 ml-3">
                  <FaUsers className="text-xl sm:text-2xl xl:text-3xl text-secondary" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-base-content/10">
                <p className="text-xs sm:text-sm text-base-content/60 truncate">
                  Total workers required
                </p>
              </div>
            </div>
          </div>

          {/* Total Coins */}
          <div className="card bg-base-100 border border-base-content/10 hover:border-accent/30 transition-all duration-300 group">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-base-content/70 text-xs sm:text-sm font-medium mb-1 truncate">
                    Coins Invested
                  </p>
                  <h3 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-accent truncate">
                    {stats.totalCoins}
                  </h3>
                </div>
                <div className="bg-accent/10 p-3 rounded-box group-hover:scale-110 transition-transform flex-shrink-0 ml-3">
                  <FaCoins className="text-xl sm:text-2xl xl:text-3xl text-accent" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-base-content/10">
                <p className="text-xs sm:text-sm text-base-content/60 truncate">
                  Total investment
                </p>
              </div>
            </div>
          </div>

          {/* Active Tasks */}
          <div className="card bg-base-100 border border-base-content/10 hover:border-info/30 transition-all duration-300 group">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-base-content/70 text-xs sm:text-sm font-medium mb-1 truncate">
                    Active Tasks
                  </p>
                  <h3 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-info truncate">
                    {stats.activeTasks}
                  </h3>
                </div>
                <div className="bg-info/10 p-3 rounded-box group-hover:scale-110 transition-transform flex-shrink-0 ml-3">
                  <FaCalendarAlt className="text-xl sm:text-2xl xl:text-3xl text-info" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-base-content/10">
                <p className="text-xs sm:text-sm text-base-content/60 truncate">
                  Currently ongoing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="card bg-base-100 border border-base-content/10">
          <div className="card-body p-0">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-primary to-secondary px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <h3 className="text-xl sm:text-2xl font-bold text-primary-content">All Tasks</h3>
              <p className="text-primary-content/80 text-sm sm:text-base mt-1">
                View, edit and manage your tasks
              </p>
            </div>

            <div className="overflow-x-auto">
              {tasks.length === 0 ? (
                <div className="text-center py-12 lg:py-16 px-4">
                  <div className="inline-block p-6 bg-base-200 rounded-box mb-4">
                    <FaImage className="text-4xl lg:text-6xl text-base-content/40 mx-auto" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-semibold text-base-content mb-3">
                    No tasks yet
                  </h4>
                  <p className="text-base-content/60 text-sm sm:text-base max-w-md mx-auto">
                    You haven't created any tasks yet. Create your first task to get started!
                  </p>
                </div>
              ) : (
                <table className="table table-zebra w-full">
                  <thead>
                    <tr className="bg-base-200">
                      <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-sm font-semibold text-base-content whitespace-nowrap">
                        Task Details
                      </th>
                      <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-sm font-semibold text-base-content whitespace-nowrap">
                        Workers
                      </th>
                      <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-sm font-semibold text-base-content whitespace-nowrap">
                        Payment
                      </th>
                      <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-sm font-semibold text-base-content whitespace-nowrap">
                        Deadline
                      </th>
                      <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center text-sm font-semibold text-base-content whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => {
                      const isExpired = new Date(task.completion_date) < new Date();

                      return (
                        <tr key={task._id} className="hover:bg-base-200/50 transition-colors duration-150">
                          <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="flex-shrink-0">
                                <img
                                  src={task.task_image_url}
                                  alt={task.task_title}
                                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-box object-cover border-2 border-base-200"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-base-content text-sm sm:text-base mb-1 truncate">
                                  {task.task_title}
                                </p>
                                <p className="text-xs sm:text-sm text-base-content/60 line-clamp-1">
                                  {task.task_detail}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                            <div className="flex items-center gap-2">
                              <div className="bg-secondary/10 p-2 rounded-box">
                                <FaUsers className="text-secondary text-sm sm:text-base" />
                              </div>
                              <span className="font-semibold text-base-content text-sm sm:text-base">
                                {task.required_workers}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                            <div className="flex items-center gap-2">
                              <div className="bg-accent/10 p-2 rounded-box">
                                <FaCoins className="text-accent text-sm sm:text-base" />
                              </div>
                              <div>
                                <p className="font-semibold text-base-content text-sm sm:text-base">
                                  {task.payable_amount}
                                </p>
                                <p className="text-xs text-base-content/60">
                                  per worker
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-box ${
                                isExpired ? "bg-error/10" : "bg-info/10"
                              }`}>
                                <FaCalendarAlt className={
                                  isExpired ? "text-error" : "text-info"
                                } />
                              </div>
                              <div>
                                <p className={`font-semibold text-xs sm:text-sm ${
                                  isExpired ? "text-error" : "text-base-content"
                                }`}>
                                  {new Date(task.completion_date).toLocaleDateString()}
                                </p>
                                {isExpired && (
                                  <span className="text-xs text-error font-medium">
                                    Expired
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                            <div className="flex gap-1 sm:gap-2 justify-center">
                              <button
                                className="btn btn-primary btn-sm sm:btn-md"
                                onClick={() => openViewModal(task)}
                                title="View Details"
                              >
                                <FaEye className="text-xs sm:text-sm" />
                              </button>
                              <button
                                className="btn btn-warning btn-sm sm:btn-md"
                                onClick={() => openEditModal(task)}
                                title="Edit Task"
                              >
                                <FaEdit className="text-xs sm:text-sm" />
                              </button>
                              <button
                                className="btn btn-error btn-sm sm:btn-md"
                                onClick={() => deleteTaskMutation.mutate(task._id)}
                                disabled={deleteTaskMutation.isPending}
                                title="Delete Task"
                              >
                                {deleteTaskMutation.isPending ? (
                                  <FaSpinner className="text-xs sm:text-sm animate-spin" />
                                ) : (
                                  <FaTrash className="text-xs sm:text-sm" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <dialog className={`modal ${isEditModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box bg-base-100 p-0 max-w-2xl w-[95%] mx-auto border border-base-content/10">
          <div className="bg-gradient-to-r from-warning to-warning/80 p-6 lg:p-8 text-warning-content">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-warning-content/20 p-3 rounded-box backdrop-blur-sm">
                <FaEdit className="text-xl lg:text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold">Update Task</h3>
                <p className="text-warning-content/80 text-sm lg:text-base mt-1">Edit your task details</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="p-6 lg:p-8 space-y-4 lg:space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">Task Title</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input input-bordered w-full focus:input-primary"
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">Task Details</span>
              </label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="textarea textarea-bordered w-full focus:textarea-primary resize-none"
                placeholder="Describe your task in detail"
                required
              ></textarea>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">Submission Instructions</span>
              </label>
              <textarea
                rows="3"
                value={formData.submission_details}
                onChange={(e) => setFormData({ ...formData, submission_details: e.target.value })}
                className="textarea textarea-bordered w-full focus:textarea-primary resize-none"
                placeholder="How should workers submit their work?"
                required
              ></textarea>
            </div>

            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={closeAllModals}>
                Cancel
              </button>
              <button type="submit" className="btn btn-warning">
                Update Task
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeAllModals}>close</button>
        </form>
      </dialog>

      {/* View Modal */}
      <dialog className={`modal ${isViewModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box bg-base-100 p-0 max-w-3xl w-[95%] mx-auto border border-base-content/10 max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 lg:p-8 text-primary-content">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary-content/20 p-3 rounded-box backdrop-blur-sm">
                <FaEye className="text-xl lg:text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold">Task Details</h3>
                <p className="text-primary-content/80 text-sm lg:text-base mt-1">
                  View complete task information
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-8 space-y-4 lg:space-y-6">
            {/* Task Image */}
            <div className="relative">
              <img
                src={selectedTask?.task_image_url}
                alt={selectedTask?.task_title}
                className="w-full h-48 lg:h-72 object-cover rounded-box border-2 border-base-200"
              />
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div className="card bg-primary/5 border border-primary/20">
                <div className="card-body p-3 lg:p-5">
                  <p className="text-sm text-primary font-semibold mb-2 flex items-center gap-2">
                    <FaImage /> Task Title
                  </p>
                  <p className="font-semibold text-base-content text-base lg:text-lg">
                    {selectedTask?.task_title}
                  </p>
                </div>
              </div>

              <div className="card bg-secondary/5 border border-secondary/20">
                <div className="card-body p-3 lg:p-5">
                  <p className="text-sm text-secondary font-semibold mb-2 flex items-center gap-2">
                    <FaUsers /> Workers Required
                  </p>
                  <p className="font-semibold text-base-content text-base lg:text-lg">
                    {selectedTask?.required_workers}
                  </p>
                </div>
              </div>

              <div className="card bg-accent/5 border border-accent/20">
                <div className="card-body p-3 lg:p-5">
                  <p className="text-sm text-accent font-semibold mb-2 flex items-center gap-2">
                    <FaCoins /> Payment per Worker
                  </p>
                  <p className="font-semibold text-base-content text-base lg:text-lg">
                    {selectedTask?.payable_amount} coins
                  </p>
                </div>
              </div>

              <div className="card bg-info/5 border border-info/20">
                <div className="card-body p-3 lg:p-5">
                  <p className="text-sm text-info font-semibold mb-2 flex items-center gap-2">
                    <FaCalendarAlt /> Deadline
                  </p>
                  <p className="font-semibold text-base-content text-base lg:text-lg">
                    {selectedTask && new Date(selectedTask.completion_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Task Details */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content flex items-center gap-2">
                  📝 Task Details
                </span>
              </label>
              <div className="bg-base-200 p-4 rounded-box border border-base-content/10">
                <p className="text-base-content leading-relaxed whitespace-pre-wrap">
                  {selectedTask?.task_detail}
                </p>
              </div>
            </div>

            {/* Submission Instructions */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content flex items-center gap-2">
                  📋 Submission Instructions
                </span>
              </label>
              <div className="bg-base-200 p-4 rounded-box border border-base-content/10">
                <p className="text-base-content leading-relaxed whitespace-pre-wrap">
                  {selectedTask?.submission_info}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modal-action">
              <button
                className="btn btn-warning flex-1"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedTask);
                }}
              >
                <FaEdit /> Edit Task
              </button>
              <button className="btn btn-ghost" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeAllModals}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default MyTasks;