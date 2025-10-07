import React from "react";
import useAuth from "../../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../components/Loading/Loading";
import useAxios from "../../../../hooks/useAxios";
import { Receipt, Calendar, Coins, DollarSign, TrendingUp, Download } from "lucide-react";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payment-history", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Calculate totals
  const totalCoins = payments.reduce((sum, payment) => sum + payment.coins, 0);
  const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount / 100), 0);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/5 border border-primary/20 rounded-2xl mb-4">
            <Receipt className="w-8 h-8 lg:w-10 lg:h-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            Payment History
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Track all your transactions and coin purchases in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 lg:mb-12">
          {/* Total Transactions */}
          <div className="card bg-base-100 border border-base-content/10 hover:border-primary/30 transition-all duration-300">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-base-content/70 text-xs sm:text-sm font-medium mb-1 truncate">Total Transactions</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary truncate">{payments.length}</h3>
                </div>
                <div className="bg-primary/10 p-2 sm:p-3 rounded-xl flex-shrink-0 ml-3">
                  <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Total Coins */}
          <div className="card bg-base-100 border border-base-content/10 hover:border-secondary/30 transition-all duration-300">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-base-content/70 text-xs sm:text-sm font-medium mb-1 truncate">Total Coins</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-secondary truncate">{totalCoins}</h3>
                </div>
                <div className="bg-secondary/10 p-2 sm:p-3 rounded-xl flex-shrink-0 ml-3">
                  <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                </div>
              </div>
            </div>
          </div>

          {/* Total Spent */}
          <div className="card bg-base-100 border border-base-content/10 hover:border-accent/30 transition-all duration-300">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-base-content/70 text-xs sm:text-sm font-medium mb-1 truncate">Total Spent</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-accent truncate">${totalAmount.toFixed(2)}</h3>
                </div>
                <div className="bg-accent/10 p-2 sm:p-3 rounded-xl flex-shrink-0 ml-3">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
              </div>
            </div>
          </div>

          {/* Average per Transaction */}
          <div className="card bg-base-100 border border-base-content/10 hover:border-info/30 transition-all duration-300">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-base-content/70 text-xs sm:text-sm font-medium mb-1 truncate">Avg. per Transaction</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-info truncate">
                    ${payments.length > 0 ? (totalAmount / payments.length).toFixed(2) : '0.00'}
                  </h3>
                </div>
                <div className="bg-info/10 p-2 sm:p-3 rounded-xl flex-shrink-0 ml-3">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-info" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="card bg-base-100 border border-base-content/10">
          <div className="card-body p-0">
            {/* Table Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 border-b border-base-content/10 bg-base-200/30">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-base-content flex items-center gap-2 truncate">
                  <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                  Transaction History
                </h2>
                <p className="text-base-content/60 text-xs sm:text-sm mt-1 truncate">
                  {payments.length} transactions found
                </p>
              </div>
              <button className="btn btn-outline btn-primary btn-sm sm:btn-md flex-shrink-0">
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Export</span>
                <span className="inline sm:hidden">Export</span>
              </button>
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-12 lg:py-16 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-base-200 border border-base-content/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 sm:w-10 sm:h-10 text-base-content/40" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-base-content/60 mb-2">No Transactions Yet</h3>
                <p className="text-base-content/50 text-sm sm:text-base max-w-sm mx-auto">
                  Your payment history will appear here once you make your first purchase.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  {/* Table Head */}
                  <thead className="bg-base-200/50">
                    <tr>
                      <th className="text-base-content font-bold py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm lg:text-base whitespace-nowrap">#</th>
                      <th className="text-base-content font-bold py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm lg:text-base whitespace-nowrap">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">Date & Time</span>
                        </div>
                      </th>
                      <th className="text-base-content font-bold py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm lg:text-base whitespace-nowrap">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Coins className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">Coins</span>
                        </div>
                      </th>
                      <th className="text-base-content font-bold py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm lg:text-base whitespace-nowrap">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">Amount</span>
                        </div>
                      </th>
                      <th className="text-base-content font-bold py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm lg:text-base whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  
                  {/* Table Body */}
                  <tbody>
                    {payments.map((payment, index) => (
                      <tr key={payment._id} className="hover:bg-base-200/30 transition-colors duration-200 border-b border-base-content/10 last:border-b-0">
                        <td className="px-3 sm:px-4 py-2 sm:py-3 font-medium text-base-content/80 text-xs sm:text-sm">
                          {index + 1}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 min-w-[140px] sm:min-w-[160px]">
                          <div className="flex flex-col">
                            <span className="font-medium text-base-content text-xs sm:text-sm truncate">
                              {new Date(payment.date).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-base-content/60 truncate">
                              {new Date(payment.date).toLocaleTimeString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-secondary flex-shrink-0" />
                            <span className="font-bold text-secondary text-xs sm:text-sm">{payment.coins}</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-success flex-shrink-0" />
                            <span className="font-bold text-success text-xs sm:text-sm">${(payment.amount / 100).toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <div className="badge badge-success badge-sm sm:badge-md gap-1 whitespace-nowrap">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full flex-shrink-0"></div>
                            <span className="text-xs">Completed</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            {payments.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 p-4 sm:p-6 border-t border-base-content/10 bg-base-200/30">
                <p className="text-base-content/60 text-xs sm:text-sm truncate">
                  Showing {payments.length} of {payments.length} transactions
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-base-content/60 whitespace-nowrap">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success rounded-full flex-shrink-0"></div>
                  All transactions completed successfully
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;