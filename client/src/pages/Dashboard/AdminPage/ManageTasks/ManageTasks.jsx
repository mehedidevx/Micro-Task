import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaTrash,
  FaTasks,
  FaSearch,
  FaUser,
  FaUsers,
  FaCoins,
  FaEye,
  FaCalendar,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { BiTask } from "react-icons/bi";
import useAxios from "../../../../hooks/useAxios";

const ManageTasks = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Get All Tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["all-tasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tasks");
      return res.data;
    },
  });

  // Delete Task
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/tasks/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-tasks"]);
      Swal.fire({
        title: "Deleted!",
        text: "Task has been deleted successfully.",
        icon: "success",
        confirmButtonColor: "#00bba7",
      });
    },
  });

  const handleDelete = (id, taskTitle) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete "${taskTitle}"? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.task_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.buyer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: tasks.length,
    totalWorkers: tasks.reduce(
      (sum, task) => sum + (task.required_workers || 0),
      0
    ),
    totalAmount: tasks.reduce(
      (sum, task) => sum + (task.payable_amount || 0),
      0
    ),
    avgAmount:
      tasks.length > 0
        ? (
            tasks.reduce((sum, task) => sum + (task.payable_amount || 0), 0) /
            tasks.length
          ).toFixed(2)
        : 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/70">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-8 border border-base-300/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
            <FaTasks className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
              Manage Tasks
              <HiSparkles className="w-6 h-6 text-warning animate-pulse" />
            </h1>
            <p className="text-base-content/60 text-sm">
              Monitor and control all tasks
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-6 border border-base-content/10  transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Total Tasks
              </p>
              <p className="text-3xl font-bold text-base-content mt-1">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <BiTask className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-6 border border-base-content/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Total Workers Needed
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {stats.totalWorkers}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <FaUsers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-6 border border-base-content/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Total Amount
              </p>
              <p className="text-3xl font-bold text-warning mt-1">
                ${stats.totalAmount}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
              <FaCoins className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-6 border border-base-content/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Avg. Amount
              </p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                ${stats.avgAmount}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <FaCoins className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-base-100 rounded-2xl p-6 border border-base-content/10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Search by task title or buyer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-12 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-base-100 rounded-2xl border border-base-content/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-base-200">
              <tr>
                <th className="text-base-content font-semibold">#</th>
                <th className="text-base-content font-semibold">Buyer</th>
                <th className="text-base-content font-semibold">
                  Task Details
                </th>
                <th className="text-base-content font-semibold">Workers</th>
                <th className="text-base-content font-semibold">Amount</th>
                <th className="text-base-content font-semibold">Status</th>
                <th className="text-base-content font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <FaTasks className="w-12 h-12 text-base-content/30" />
                      <p className="text-base-content/60">No tasks found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task, index) => (
                  <tr
                    key={task._id}
                    className="hover:bg-base-200/50 transition-colors"
                  >
                    <td className="font-medium">{index + 1}</td>

                    {/* Buyer Info */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                          <FaUser className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-base-content">
                            {task.buyer_name || "Unknown"}
                          </p>
                          <p className="text-xs text-base-content/60">
                            {task.buyer_email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Task Details */}
                    <td>
                      <div>
                        <p className="font-semibold text-base-content max-w-xs truncate">
                          {task.task_title}
                        </p>
                        <p className="text-xs text-base-content/60 max-w-xs truncate">
                          {task.task_detail || "No description"}
                        </p>
                        {task.submission_deadline && (
                          <div className="flex items-center gap-1 mt-1">
                            <FaCalendar className="w-3 h-3 text-base-content/40" />
                            <span className="text-xs text-base-content/60">
                              {new Date(
                                task.submission_deadline
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Workers */}
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <FaUsers className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-blue-600">
                          {task.required_workers || 0}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td>
                      <div className="flex items-center gap-2">
                        <FaCoins className="w-4 h-4 text-warning" />
                        <span className="font-bold text-warning">
                          ${task.payable_amount || 0}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          task.task_status === "completed"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : task.task_status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        }`}
                      >
                        {task.task_status || "Active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleDelete(task._id, task.task_title)
                          }
                          className="btn btn-sm btn-error rounded-lg hover:scale-105 transition-all duration-300 hover:shadow-lg"
                          title="Delete Task"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Info */}
      {filteredTasks.length > 0 && (
        <div className="text-center text-sm text-base-content/60">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      )}
    </div>
  );
};

export default ManageTasks;
