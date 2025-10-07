import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, FileText, Clock, CheckCircle, TrendingUp, Award, User } from "lucide-react";
import Loading from "../../../components/Loading/Loading";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";

const WorkerDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  // Get all submissions by this worker
  const { data = {} } = useQuery({
    queryKey: ["mySubmissions", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/submissions?worker_email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const submissions = data.submissions || [];

  const { data: withdrawals = [], isLoading } = useQuery({
    queryKey: ["myWithdrawals", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/withdrawals?worker_email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Calculations
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter((s) => s.status === "pending").length;
  const totalEarning = withdrawals
    .filter((s) => s.status === "approved")
    .reduce((sum, item) => sum + (item.withdrawal_amount || 0), 0);
  const approvedSubmissions = submissions.filter((s) => s.status === "approved");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back, Worker! 👋</h1>
              <p className="text-teal-100 text-lg">Here's your performance overview</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
              <User className="w-8 h-8" />
              <div>
                <p className="font-semibold">{user?.displayName || "Worker"}</p>
                <p className="text-sm text-teal-100">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Submissions Card */}
          <div className="bg-white rounded-2xl border border-base-content/10 p-6  transition-shadow duration-300 ">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4 text-blue-600 inline" />
              </div>
            </div>
            <h4 className="text-gray-600 text-sm font-medium mb-1">Total Submissions</h4>
            <p className="text-4xl font-bold text-gray-800">{totalSubmissions}</p>
            <p className="text-sm text-gray-500 mt-2">All time submissions</p>
          </div>

          {/* Pending Submissions Card */}
          <div className="bg-white rounded-2xl  p-6  transition-shadow duration-300 border border-base-content/10">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="bg-yellow-50 px-3 py-1 rounded-full">
                <span className="text-yellow-600 text-xs font-semibold">Waiting</span>
              </div>
            </div>
            <h4 className="text-gray-600 text-sm font-medium mb-1">Pending Submissions</h4>
            <p className="text-4xl font-bold text-gray-800">{pendingSubmissions}</p>
            <p className="text-sm text-gray-500 mt-2">Awaiting review</p>
          </div>

          {/* Total Earning Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl  p-6 border border-base-content/10 transition-shadow duration-300 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <Award className="w-6 h-6 text-green-200" />
            </div>
            <h4 className="text-green-100 text-sm font-medium mb-1">Total Earnings</h4>
            <p className="text-4xl font-bold">${totalEarning.toLocaleString()}</p>
            <p className="text-sm text-green-100 mt-2">Approved withdrawals</p>
          </div>
        </div>

        {/* Approved Submissions Table */}
        <div className="bg-white rounded-2xl  overflow-hidden border border-base-content/10">
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-5">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-white" />
              <h3 className="text-2xl font-bold text-white">Approved Submissions</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Task Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Buyer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {approvedSubmissions.map((sub, index) => (
                  <tr key={sub._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{sub.task_title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-lg font-bold text-green-600">{sub.payable_amount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                          {sub.buyer_name?.charAt(0) || "B"}
                        </div>
                        <span className="text-gray-700">{sub.buyer_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {approvedSubmissions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-gray-100 p-4 rounded-full">
                          <FileText className="w-12 h-12 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">No approved submissions yet</p>
                        <p className="text-gray-400 text-sm">Your approved work will appear here</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {approvedSubmissions.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <p className="text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{approvedSubmissions.length}</span> approved submissions
                </p>
                <p className="text-gray-600">
                  Total earned: <span className="font-bold text-green-600 text-lg">${approvedSubmissions.reduce((sum, s) => sum + s.payable_amount, 0).toLocaleString()}</span>
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default WorkerDashboard;