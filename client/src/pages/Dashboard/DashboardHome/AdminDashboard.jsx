import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaCheck, FaUsers, FaCoins, FaMoneyBillWave, FaShoppingCart, FaClock, FaCheckCircle, FaTimes } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { BiStats } from "react-icons/bi";
import { MdPending } from "react-icons/md";
import useAxios from "../../../hooks/useAxios";
import Loading from "../../../components/Loading/Loading";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";

const AdminDashboard = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // 📊 Fetch admin stats
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const [usersRes, tasksRes] = await Promise.all([
        axiosSecure.get("/users"),
        axiosSecure.get("/tasks"),
      ]);

      const users = usersRes.data || [];
      const tasks = tasksRes.data || [];

      const totalWorkers = users.filter((u) => u.role === "Worker").length;
      const totalBuyers = users.filter((u) => u.role === "Buyer").length;

      const totalTaskCoins = tasks.reduce(
        (sum, task) => sum + task.required_workers * task.payable_amount,
        0
      );
      const totalPayments = tasks.reduce(
        (sum, task) => sum + (task.payment_amount || 0),
        0
      );

      return { totalWorkers, totalBuyers, totalTaskCoins, totalPayments };
    },
  });

  // 💸 Fetch withdrawal requests
  const { data: withdrawRequests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ["withdrawRequests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/withdraw-requests");
      return res.data;
    },
  });

  // 🧾 Fetch total withdrawals (approved)
  const { data } = useQuery({
    queryKey: ["withdrawals", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/withdrawals", {
        params: { email: user?.email },
      });
      return res.data;
    },
    enabled: !!user?.email,
  });

  const withdrawals = data || [];
  const totalWithdrawalAmount = withdrawals
    .filter((item) => item.status === "approved")
    .reduce((sum, item) => sum + (item.withdrawal_amount || 0), 0);

  // ✅ Mutation to approve withdrawal requests
  const approveMutation = useMutation({
    mutationFn: async ({ id, email }) => {
      await axiosSecure.patch(`/admin/withdraw-requests/${id}/approve`, {
        email,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawRequests"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      toast.success("Withdrawal approved successfully!");
    },
    onError: () => {
      toast.error("Failed to approve withdrawal.");
    },
  });

  // Calculate pending requests
  const pendingRequests = withdrawRequests.filter(req => req.status === "pending").length;
  const approvedRequests = withdrawRequests.filter(req => req.status === "approved").length;

  if (statsLoading || requestsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-8 border border-base-content/5">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
            <BiStats className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
              Welcome, Admin 👑
              <HiSparkles className="w-7 h-7 text-warning animate-pulse" />
            </h1>
            <p className="text-base-content/60 text-sm mt-1">
              Here's what's happening with your platform today
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Workers */}
        <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-6 border border-base-content/10 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
              <FaUsers className="w-7 h-7 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-base-content/60 text-sm font-medium mb-1">Total Workers</h3>
          <p className="text-4xl font-bold text-base-content">{stats.totalWorkers ?? 0}</p>
          <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
            <span>⚡</span>
            <span>Workforce</span>
          </div>
        </div>

        {/* Total Buyers */}
        <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-6 border border-base-content/10 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
              <FaShoppingCart className="w-7 h-7 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              Buyers
            </span>
          </div>
          <h3 className="text-base-content/60 text-sm font-medium mb-1">Total Buyers</h3>
          <p className="text-4xl font-bold text-base-content">{stats.totalBuyers ?? 0}</p>
          <div className="mt-3 flex items-center gap-1 text-xs text-blue-600">
            <span>💼</span>
            <span>Task Creators</span>
          </div>
        </div>

        {/* Total Coins */}
        <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-6 border border-base-content/10 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-warning/20 rounded-2xl flex items-center justify-center">
              <FaCoins className="w-7 h-7 text-warning" />
            </div>
            <span className="text-xs font-semibold text-warning bg-warning/20 px-3 py-1 rounded-full">
              Coins
            </span>
          </div>
          <h3 className="text-base-content/60 text-sm font-medium mb-1">Total Coins</h3>
          <p className="text-4xl font-bold text-warning">{stats.totalTaskCoins ?? 0}</p>
          <div className="mt-3 flex items-center gap-1 text-xs text-warning">
            <span>💰</span>
            <span>In Circulation</span>
          </div>
        </div>

        {/* Total Payments */}
        <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-6 border border-base-content/10 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-success/20 rounded-2xl flex items-center justify-center">
              <FaMoneyBillWave className="w-7 h-7 text-success" />
            </div>
            <span className="text-xs font-semibold text-success bg-success/20 px-3 py-1 rounded-full">
              Paid
            </span>
          </div>
          <h3 className="text-base-content/60 text-sm font-medium mb-1">Total Payments</h3>
          <p className="text-4xl font-bold text-success">
            ${totalWithdrawalAmount.toFixed(2) ?? "0.00"}
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs text-success">
            <span>✅</span>
            <span>Withdrawn</span>
          </div>
        </div>
      </div>

      {/* Withdrawal Requests Section */}
      <div className="bg-base-100 rounded-2xl border border-base-content/10 overflow-hidden">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b border-base-300/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-base-content flex items-center gap-2">
                <FaMoneyBillWave className="w-6 h-6 text-primary" />
                Withdrawal Requests
              </h3>
              <p className="text-base-content/60 text-sm mt-1">
                Review and approve withdrawal requests
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-warning/20 px-4 py-2 rounded-full">
                <MdPending className="w-5 h-5 text-warning" />
                <span className="font-bold text-warning">{pendingRequests}</span>
                <span className="text-xs text-warning/70">Pending</span>
              </div>
              <div className="flex items-center gap-2 bg-success/20 px-4 py-2 rounded-full">
                <FaCheckCircle className="w-5 h-5 text-success" />
                <span className="font-bold text-success">{approvedRequests}</span>
                <span className="text-xs text-success/70">Approved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-base-200">
              <tr>
                <th className="text-base-content font-semibold">#</th>
                <th className="text-base-content font-semibold">User Email</th>
                <th className="text-base-content font-semibold">Amount</th>
                <th className="text-base-content font-semibold">Status</th>
                <th className="text-base-content font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center">
                        <FaMoneyBillWave className="w-8 h-8 text-base-content/30" />
                      </div>
                      <p className="text-base-content/60 font-medium">No withdrawal requests found</p>
                      <p className="text-base-content/40 text-sm">All requests have been processed</p>
                    </div>
                  </td>
                </tr>
              ) : (
                withdrawRequests.map((req, index) => (
                  <tr key={req._id} className="hover:bg-base-200/50 transition-colors">
                    <td className="font-medium">{index + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {(req.worker_email || req.email)?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-base-content">
                            {req.worker_email || req.email}
                          </p>
                          <p className="text-xs text-base-content/60">
                            ID: {req._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FaCoins className="w-4 h-4 text-warning" />
                        <span className="font-bold text-warning text-lg">
                          ${req.withdrawal_amount ?? req.amount}
                        </span>
                      </div>
                    </td>
                    <td>
                      {req.status === "pending" ? (
                        <span className="px-3 py-1.5 bg-warning/20 text-warning rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                          <FaClock className="w-3 h-3" />
                          Pending
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-success/20 text-success rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                          <FaCheckCircle className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      {req.status === "pending" ? (
                        <button
                          onClick={() =>
                            approveMutation.mutate({
                              id: req._id,
                              email: req.worker_email ?? req.email,
                            })
                          }
                          className="btn btn-success btn-sm rounded-lg gap-2 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                          disabled={approveMutation.isLoading}
                        >
                          <FaCheck className="w-3 h-3" />
                          Approve
                        </button>
                      ) : (
                        <span className="px-4 py-2 bg-base-200 text-base-content/60 rounded-lg text-sm font-medium flex items-center gap-2 justify-center">
                          <FaCheckCircle className="w-4 h-4 text-success" />
                          Approved
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {withdrawRequests.length > 0 && (
          <div className="bg-base-200/50 p-4 border-t border-base-300/50">
            <p className="text-center text-sm text-base-content/60">
              Showing {withdrawRequests.length} withdrawal request{withdrawRequests.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;