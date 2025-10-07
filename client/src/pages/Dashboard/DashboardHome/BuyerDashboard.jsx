import React, { useState, useMemo } from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaCheck,
  FaTimes,
  FaEye,
  FaTasks,
  FaUsers,
  FaCoins,
  FaSpinner,
} from "react-icons/fa";
import useAxios from "../../../hooks/useAxios";
import toast from "react-hot-toast";
import Loading from "../../../components/Loading/Loading";

const BuyerDashboard = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const [modalState, setModalState] = useState({
    isOpen: false,
    submission: null,
  });
  const queryClient = useQueryClient();

  // Fetch tasks
  const {
    data: tasks = [],
    isLoading: tasksLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["myTasks", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks?creator_email=${user.email}`);
      return res.data;
    },
  });

  // Fetch pending submissions
  const {
    data: submissions = [],
    isLoading: submissionsLoading,
    error: submissionsError,
  } = useQuery({
    queryKey: ["buyerSubmissions", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/submissions?buyer_email=${user.email}`
      );
      return res.data.submissions.filter((sub) => sub.status === "pending");
    },
    enabled: !!user?.email,
  });

  // Fetch approved submissions
  const { data: approvedSubmissions = [] } = useQuery({
    queryKey: ["approvedSubmissions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/submissions?buyer_email=${user.email}&status=approved`
      );
      return res.data.submissions;
    },
  });

  // Calculate total paid with memoization
  const totalPaid = useMemo(() => {
    return approvedSubmissions.reduce(
      (sum, sub) => sum + (sub.payable_amount || 0),
      0
    );
  }, [approvedSubmissions]);

  // Approve submission mutation
  const approveMutation = useMutation({
    mutationFn: async (submission) => {
      const res = await axiosSecure.patch(
        `/buyer/submissions/${submission._id}/approve`
      );
      return res.data;
    },
    onSuccess: async (_data, submission) => {
      toast.success("Submission approved successfully!");

      await axiosSecure.post("/notifications", {
        worker_email: submission.worker_email,
        buyer_email: user.email,
        message: `Your submission for "${submission.task_title}" has been approved!`,
        title: submission.task_title,
        buyerName: submission.buyer_name,
        coin: submission.payable_amount,
        type: "task_approved",
        actionRoute: "/dashboard",
      });

      queryClient.invalidateQueries({
        queryKey: ["buyerSubmissions", user?.email],
      });
      queryClient.invalidateQueries({ queryKey: ["myTasks", user?.email] });
      queryClient.invalidateQueries({
        queryKey: ["approvedSubmissions", user?.email],
      });
    },
    onError: () => {
      toast.error("Failed to approve submission");
    },
  });

  // Reject submission mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ submissionId, taskId }) => {
      await axiosSecure.patch(`/buyer/submissions/${submissionId}/reject`, {
        taskId,
      });
    },
    onSuccess: () => {
      toast.success("Submission rejected!");
      queryClient.invalidateQueries({
        queryKey: ["buyerSubmissions", user?.email],
      });
    },
    onError: () => {
      toast.error("Failed to reject submission");
    },
  });

  // Loading state
  if (tasksLoading || submissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loading></Loading>
        </div>
      </div>
    );
  }

  // Error state
  if (tasksError || submissionsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-error/10 border border-error/20 rounded-box p-6 max-w-md">
          <h3 className="text-error font-semibold text-lg mb-2">
            Error Loading Data
          </h3>
          <p className="text-error/80">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-box p-6 lg:p-8 text-primary-content">
          <h2 className="text-2xl lg:text-4xl font-bold mb-2">
            Welcome Back, {user?.displayName || "Buyer"}
          </h2>
          <p className="text-primary-content/80 text-sm lg:text-base">
            Manage your tasks and review worker submissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Total Tasks */}
          <div className="card bg-base-100 border border-base-content/10 hover:border-primary/30 transition-all duration-300">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-base-content/70 text-xs sm:text-sm font-medium mb-1 truncate">
                    Total Tasks
                  </p>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary truncate">
                    {tasks.length}
                  </h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-box flex-shrink-0 ml-3">
                  <FaTasks className="text-xl sm:text-2xl lg:text-3xl text-primary" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-base-content/10">
                <p className="text-xs sm:text-sm text-base-content/60 truncate">
                  Active projects
                </p>
              </div>
            </div>
          </div>

          {/* Pending Workers */}
          <div className="card bg-base-100 border border-base-content/10 hover:border-warning/30 transition-all duration-300">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-base-content/70 text-xs sm:text-sm font-medium mb-1 truncate">
                    Pending Reviews
                  </p>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-warning truncate">
                    {submissions.length}
                  </h3>
                </div>
                <div className="bg-warning/10 p-3 rounded-box flex-shrink-0 ml-3">
                  <FaUsers className="text-xl sm:text-2xl lg:text-3xl text-warning" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-base-content/10">
                <p className="text-xs sm:text-sm text-base-content/60 truncate">
                  Awaiting your approval
                </p>
              </div>
            </div>
          </div>

          {/* Total Paid */}
          <div className="card bg-base-100 border border-base-content/10 hover:border-success/30 transition-all duration-300">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-base-content/70 text-xs sm:text-sm font-medium mb-1 truncate">
                    Total Paid
                  </p>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-success truncate">
                    {totalPaid}
                  </h3>
                </div>
                <div className="bg-success/10 p-3 rounded-box flex-shrink-0 ml-3">
                  <FaCoins className="text-xl sm:text-2xl lg:text-3xl text-success" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-base-content/10">
                <p className="text-xs sm:text-sm text-base-content/60 truncate">
                  Coins distributed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="card bg-base-100 border border-base-content/10">
          <div className="card-body p-0">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <h3 className="text-xl sm:text-2xl font-bold text-primary-content">Tasks To Review</h3>
              <p className="text-primary-content/80 text-sm sm:text-base mt-1">
                Review and approve worker submissions
              </p>
            </div>

            <div className="overflow-x-auto">
              {submissions.length === 0 ? (
                <div className="text-center py-12 lg:py-16 px-4">
                  <div className="inline-block p-6 bg-base-200 rounded-box mb-4">
                    <FaUsers className="text-4xl lg:text-5xl text-base-content/40" />
                  </div>
                  <h4 className="text-xl font-semibold text-base-content mb-2">
                    No Pending Submissions
                  </h4>
                  <p className="text-base-content/60 text-sm sm:text-base">
                    All submissions have been reviewed
                  </p>
                </div>
              ) : (
                <table className="table table-zebra w-full">
                  <thead>
                    <tr className="bg-base-200">
                      <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-sm font-semibold text-base-content whitespace-nowrap">
                        Worker
                      </th>
                      <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-sm font-semibold text-base-content whitespace-nowrap">
                        Task
                      </th>
                      <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-sm font-semibold text-base-content whitespace-nowrap">
                        Amount
                      </th>
                      <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center text-sm font-semibold text-base-content whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub) => (
                      <tr key={sub._id} className="hover:bg-base-200/50 transition-colors duration-150">
                        <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-content font-semibold text-sm sm:text-base flex-shrink-0">
                              {sub.worker_name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-base-content text-sm sm:text-base truncate">
                              {sub.worker_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                          <span className="text-base-content text-sm sm:text-base truncate">{sub.task_title}</span>
                        </td>
                        <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                          <span className="badge badge-success badge-lg gap-1 whitespace-nowrap">
                            <FaCoins className="text-xs" /> {sub.payable_amount}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                          <div className="flex gap-1 sm:gap-2 justify-center">
                            <button
                              className="btn btn-primary btn-sm sm:btn-md"
                              onClick={() => setModalState({ isOpen: true, submission: sub })}
                              title="View Details"
                            >
                              <FaEye className="text-xs sm:text-sm" />
                            </button>
                            <button
                              className="btn btn-success btn-sm sm:btn-md"
                              onClick={() => approveMutation.mutate(sub)}
                              disabled={approveMutation.isPending}
                              title="Approve"
                            >
                              {approveMutation.isPending ? (
                                <FaSpinner className="text-xs sm:text-sm animate-spin" />
                              ) : (
                                <FaCheck className="text-xs sm:text-sm" />
                              )}
                            </button>
                            <button
                              className="btn btn-error btn-sm sm:btn-md"
                              onClick={() => rejectMutation.mutate({
                                submissionId: sub._id,
                                taskId: sub.task_id,
                              })}
                              disabled={rejectMutation.isPending}
                              title="Reject"
                            >
                              {rejectMutation.isPending ? (
                                <FaSpinner className="text-xs sm:text-sm animate-spin" />
                              ) : (
                                <FaTimes className="text-xs sm:text-sm" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Submission Modal */}
        <dialog className={`modal ${modalState.isOpen ? 'modal-open' : ''}`}>
          <div className="modal-box bg-base-100 p-0 max-w-2xl w-[95%] mx-auto border border-base-content/10">
            <div className="bg-gradient-to-r from-primary to-primary/80 px-6 lg:p-8 py-4 lg:py-6">
              <h3 className="text-xl lg:text-2xl font-bold text-primary-content">Submission Details</h3>
            </div>
            <div className="p-4 lg:p-8 space-y-4 lg:space-y-6">
              <div className="flex items-center gap-4 pb-4 lg:pb-6 border-b border-base-content/10">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-content font-bold text-lg lg:text-2xl flex-shrink-0">
                  {modalState.submission?.worker_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-base-content/60 font-medium">Worker Name</p>
                  <p className="text-base lg:text-xl font-semibold text-base-content truncate">
                    {modalState.submission?.worker_name}
                  </p>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">Task Title</span>
                </label>
                <p className="text-base lg:text-lg text-base-content font-medium">
                  {modalState.submission?.task_title}
                </p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">Payment Amount</span>
                </label>
                <span className="badge badge-success badge-lg gap-2 w-fit">
                  <FaCoins /> {modalState.submission?.payable_amount} Coins
                </span>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">Submission Details</span>
                </label>
                <div className="bg-base-200 rounded-box p-4 border border-base-content/10">
                  <p className="text-base-content leading-relaxed whitespace-pre-wrap">
                    {modalState.submission?.submission_details || "No additional details provided"}
                  </p>
                </div>
              </div>

              <div className="modal-action flex-col sm:flex-row gap-3">
                <button
                  className="btn btn-success flex-1"
                  onClick={() => {
                    approveMutation.mutate(modalState.submission);
                    setModalState({ isOpen: false, submission: null });
                  }}
                  disabled={approveMutation.isPending}
                >
                  {approveMutation.isPending ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      Approve
                    </>
                  )}
                </button>
                <button
                  className="btn btn-error flex-1"
                  onClick={() => {
                    rejectMutation.mutate({
                      submissionId: modalState.submission._id,
                      taskId: modalState.submission.task_id,
                    });
                    setModalState({ isOpen: false, submission: null });
                  }}
                  disabled={rejectMutation.isPending}
                >
                  {rejectMutation.isPending ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <FaTimes />
                      Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setModalState({ isOpen: false, submission: null })}>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default BuyerDashboard;