import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth";
import useAxios from "../../../../hooks/useAxios";
import Loading from "../../../../components/Loading/Loading";

const Withdrawals = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const [coinToWithdraw, setCoinToWithdraw] = useState(0);
  const [paymentSystem, setPaymentSystem] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  // ✅ Fetch user data
  const { data: userData = {}, isLoading } = useQuery({
    queryKey: ["user", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  const totalCoins = userData?.coin || 0;
  const withdrawableAmount = (coinToWithdraw / 20).toFixed(2);
  const totalWithdrawableAmount = (totalCoins / 20).toFixed(2);

  // ✅ Withdraw + Coin Patch Mutation
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (coinToWithdraw > totalCoins) {
        throw new Error("❌ You don't have enough coins.");
      }

      // 1️⃣ Patch user coin (using negative value)
      await axiosSecure.patch("/users", {
        email: user.email,
        coins: -parseInt(coinToWithdraw),
      });

      // 2️⃣ Create withdrawal record
      const withdrawal = {
        worker_email: user.email,
        worker_name: user.displayName,
        withdrawal_coin: parseInt(coinToWithdraw),
        withdrawal_amount: parseFloat(withdrawableAmount),
        payment_system: paymentSystem,
        account_number: accountNumber,
        withdraw_date: new Date().toISOString(),
        status: "pending",
      };

      await axiosSecure.post("/withdrawals", withdrawal);
    },
    onSuccess: () => {
      Swal.fire({
        title: "✅ Success!",
        text: "Your withdrawal request has been submitted successfully!",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
      queryClient.invalidateQueries(["user", user?.email]);
      setCoinToWithdraw(0);
      setPaymentSystem("");
      setAccountNumber("");
    },
    onError: (err) => {
      Swal.fire({
        title: "❌ Error",
        text: err.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await mutateAsync();
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Micro Task
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-base-content">Withdraw Your Earnings</h2>
          <p className="text-base-content/70 mt-2">Convert your earned coins to real money</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content/70">Total Coins</h3>
                  <p className="text-2xl font-bold text-primary">{totalCoins.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content/70">Available Balance</h3>
                  <p className="text-2xl font-bold text-success">${totalWithdrawableAmount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Withdrawal Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {totalCoins >= 200 ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Coin Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Coins to Withdraw</span>
                    <span className="label-text-alt text-base-content/60">Min: 200 coins</span>
                  </label>
                  <input
                    type="number"
                    min="200"
                    max={totalCoins}
                    value={coinToWithdraw}
                    onChange={(e) => setCoinToWithdraw(e.target.value)}
                    className="input input-bordered input-primary focus:input-primary"
                    placeholder="Enter amount to withdraw"
                    required
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      Available: {totalCoins} coins
                    </span>
                  </label>
                </div>

                {/* USD Amount Display */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">You will receive</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={coinToWithdraw ? `$${withdrawableAmount}` : '$0.00'}
                      readOnly
                      className="input input-bordered bg-base-200 text-lg font-bold text-success pl-10"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      Conversion rate: 20 coins = $1
                    </span>
                  </label>
                </div>

                {/* Payment System */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Payment Method</span>
                  </label>
                  <select
                    value={paymentSystem}
                    onChange={(e) => setPaymentSystem(e.target.value)}
                    className="select select-bordered select-primary focus:select-primary"
                    required
                  >
                    <option value="" disabled>
                      Choose your payment method
                    </option>
                    <option value="Bkash">💳 Bkash</option>
                    <option value="Rocket">🚀 Rocket</option>
                    <option value="Nagad">💰 Nagad</option>
                    <option value="Upay">📱 Upay</option>
                  </select>
                </div>

                {/* Account Number */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Account Number</span>
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="input input-bordered input-primary focus:input-primary"
                    placeholder="Enter your account number"
                    required
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      Make sure your account number is correct
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="card-actions justify-end pt-4">
                  <button
                    type="submit"
                    className={`btn btn-primary btn-lg w-full ${isPending ? 'loading' : ''}`}
                    disabled={isPending || coinToWithdraw > totalCoins || !coinToWithdraw || coinToWithdraw < 200}
                  >
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Submit Withdrawal Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.181 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-base-content mb-2">Minimum Balance Required</h3>
                <p className="text-base-content/70 mb-4">
                  You need at least <span className="font-bold text-primary">200 coins</span> to make a withdrawal.
                </p>
                <p className="text-base-content/60">
                  Current balance: <span className="font-semibold">{totalCoins} coins</span>
                </p>
                <p className="text-base-content/60">
                  Need <span className="font-semibold text-warning">{200 - totalCoins} more coins</span>
                </p>
                <div className="mt-6">
                  <button className="btn btn-outline btn-primary">
                    Complete More Tasks
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="alert alert-info mt-6">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold">Withdrawal Information</h4>
            <p className="text-sm">Processing time: 1-3 business days. Make sure your account details are correct as withdrawals cannot be reversed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawals;