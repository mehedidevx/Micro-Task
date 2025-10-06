import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth";
import { FaEdit, FaTrash, FaEye, FaCoins, FaUsers, FaCalendarAlt, FaImage } from "react-icons/fa";
import useAxios from "../../../../hooks/useAxios";
import toast from "react-hot-toast";
import { useState } from "react";
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
      console.log(error)
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

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            My Created Tasks
          </h1>
          <p className="text-base-content/70">
            Manage your tasks and track their progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl p-4 border border-base-content/10 ">
            <div className="flex items-center">
              <div className="bg-primary/20 p-3 rounded-xl mr-4">
                <FaImage className="text-2xl text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tasks.length}</p>
                <p className="text-sm text-base-content/70">Total Tasks</p>
              </div>
            </div>
          </div>
          
          <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl p-4 border border-base-content/10 ">
            <div className="flex items-center">
              <div className="bg-secondary/20 p-3 rounded-xl mr-4">
                <FaUsers className="text-2xl text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {tasks.reduce((sum, task) => sum + (task.required_workers || 0), 0)}
                </p>
                <p className="text-sm text-base-content/70">Total Workers Needed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl p-4 border border-base-content/10 ">
            <div className="flex items-center">
              <div className="bg-warning/20 p-3 rounded-xl mr-4">
                <FaCoins className="text-2xl text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {tasks.reduce((sum, task) => sum + (task.payable_amount * task.required_workers || 0), 0)}
                </p>
                <p className="text-sm text-base-content/70">Total Coins Invested</p>
              </div>
            </div>
          </div>
          
          <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl p-4 border border-base-content/10 ">
            <div className="flex items-center">
              <div className="bg-info/20 p-3 rounded-xl mr-4">
                <FaCalendarAlt className="text-2xl text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {tasks.filter(task => new Date(task.completion_date) > new Date()).length}
                </p>
                <p className="text-sm text-base-content/70">Active Tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-base-100/90 backdrop-blur-sm rounded-xl  overflow-hidden border border-base-content/10">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gradient-to-r from-primary to-secondary text-white">
                <tr>
                  <th className="">Task</th>
                  <th>Workers</th>
                  <th>Payment</th>
                  <th>Deadline</th>
                  <th className="">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, idx) => (
                  <tr key={task._id} className="hover:bg-base-200/50 border-b border-base-content/10">
                    <td>
                      <div className="flex items-center space-x-4">
                        <div className="avatar">
                          <div className="w-14 h-14 rounded-xl">
                            <img 
                              src={task.task_image_url} 
                              alt={task.task_title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-base-content">{task.task_title}</div>
                          <div className="text-sm text-base-content/70 line-clamp-1">{task.task_detail}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <FaUsers className="text-info mr-2" />
                        <span className="font-semibold">{task.required_workers}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <FaCoins className="text-warning mr-2" />
                        <span className="font-semibold">{task.payable_amount}</span>
                        <span className="text-sm text-base-content/70 ml-1">/worker</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-error mr-2" />
                        <span className={new Date(task.completion_date) < new Date() ? 'text-error' : ''}>
                          {new Date(task.completion_date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          className="btn btn-sm btn-ghost btn-circle text-info hover:text-info/80 hover:bg-info/20"
                          onClick={() => openViewModal(task)}
                          title="View Task"
                        >
                          <FaEye className="text-lg" />
                        </button>
                        <button
                          className="btn btn-sm btn-ghost btn-circle text-warning hover:text-warning/80 hover:bg-warning/20"
                          onClick={() => openEditModal(task)}
                          title="Edit Task"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          className="btn btn-sm btn-ghost btn-circle text-error hover:text-error/80 hover:bg-error/20"
                          onClick={() => deleteTaskMutation.mutate(task._id)}
                          title="Delete Task"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {tasks.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-base-200/50 rounded-2xl p-8 max-w-md mx-auto">
                  <div className="bg-primary/20 p-4 rounded-2xl inline-block mb-4">
                    <FaImage className="text-4xl text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-base-content mb-2">No tasks yet</h3>
                  <p className="text-base-content/70 mb-4">You haven't created any tasks yet. Create your first task to get started!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div
            className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-base-content/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
              <h3 className="text-2xl font-bold">Update Task</h3>
              <p className="text-primary-content/80">Edit your task details</p>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-base-content">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl bg-base-200/50 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-base-content">Task Details</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl bg-base-200/50 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-base-content">Submission Instructions</label>
                <textarea
                  rows="3"
                  value={formData.submission_details}
                  onChange={(e) => setFormData({ ...formData, submission_details: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl bg-base-200/50 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div
            className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-base-content/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
              <h3 className="text-2xl font-bold">Task Details</h3>
              <p className="text-primary-content/80">View your task information</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-center">
                <img 
                  src={selectedTask.task_image_url} 
                  alt={selectedTask.task_title}
                  className="w-full h-64 object-cover rounded-2xl"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-base-200/50 p-4 rounded-xl">
                  <p className="text-sm text-base-content/70">Task Title</p>
                  <p className="font-semibold">{selectedTask.task_title}</p>
                </div>
                
                <div className="bg-base-200/50 p-4 rounded-xl">
                  <p className="text-sm text-base-content/70">Workers Required</p>
                  <p className="font-semibold">{selectedTask.required_workers}</p>
                </div>
                
                <div className="bg-base-200/50 p-4 rounded-xl">
                  <p className="text-sm text-base-content/70">Payment per Worker</p>
                  <p className="font-semibold">{selectedTask.payable_amount} coins</p>
                </div>
                
                <div className="bg-base-200/50 p-4 rounded-xl">
                  <p className="text-sm text-base-content/70">Deadline</p>
                  <p className="font-semibold">{new Date(selectedTask.completion_date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-base-content">Task Details</label>
                <div className="bg-base-200/50 p-4 rounded-xl">
                  <p className="whitespace-pre-wrap">{selectedTask.task_detail}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-base-content">Submission Instructions</label>
                <div className="bg-base-200/50 p-4 rounded-xl">
                  <p className="whitespace-pre-wrap">{selectedTask.submission_info}</p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  className="btn btn-primary"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;