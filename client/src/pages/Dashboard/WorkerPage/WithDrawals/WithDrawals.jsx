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
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl mb-4 transform hover:scale-105 transition-all duration-300">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Withdraw Earnings
            </h1>
            <p className="text-lg text-base-content/70 max-w-md mx-auto">
              Convert your hard-earned coins into real money instantly
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1  gap-8">
          {/* Left Side - Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Total Coins Card */}
            <div className="card bg-base-100 border border-base-content/10  transform hover:scale-[1.02] transition-all duration-300">
              <div className="card-body p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <svg
                      className="w-5 h-5 sm:w-7 sm:h-7 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-base-content/70 uppercase tracking-wide truncate">
                      Total Coins
                    </h3>
                    <p className="text-2xl sm:text-3xl font-bold text-primary mt-1 truncate">
                      {totalCoins.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse flex-shrink-0"></div>
                      <span className="text-xs text-base-content/60 truncate">
                        Available for withdrawal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Balance Card */}
            <div className="card bg-base-100 border border-base-content/10  transform hover:scale-[1.02] transition-all duration-300">
              <div className="card-body p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-success to-success/80 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <svg
                      className="w-5 h-5 sm:w-7 sm:h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-base-content/70 uppercase tracking-wide truncate">
                      Available Balance
                    </h3>
                    <p className="text-2xl sm:text-3xl font-bold text-success mt-1 truncate">
                      ${totalWithdrawableAmount}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse flex-shrink-0"></div>
                      <span className="text-xs text-base-content/60 truncate">
                        Ready to withdraw
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion Rate Card */}
            <div className="card bg-base-100 border border-base-content/10  transform hover:scale-[1.02] transition-all duration-300">
              <div className="card-body p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-info to-info/80 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <svg
                      className="w-5 h-5 sm:w-7 sm:h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-base-content/70 uppercase tracking-wide truncate">
                      Conversion Rate
                    </h3>
                    <p className="text-xl sm:text-2xl font-bold text-info mt-1 truncate">
                      20 Coins = $1
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-info rounded-full animate-pulse flex-shrink-0"></div>
                      <span className="text-xs text-base-content/60 truncate">
                        Fixed rate
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Withdrawal Form */}
          <div className="">
            <div className="card bg-base-100 border border-base-content/10">
              <div className="card-body p-8">
                {totalCoins >= 200 ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Coin Input */}
                      <div className="form-control md:col-span-2">
                        <label className="label">
                          <span className="label-text font-bold text-lg">
                            Coins to Withdraw
                          </span>
                          <span className="label-text-alt text-base-content/60 font-semibold">
                            Min: 200 coins
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="200"
                            max={totalCoins}
                            value={coinToWithdraw}
                            onChange={(e) => setCoinToWithdraw(e.target.value)}
                            className="input input-bordered input-lg input-primary w-full focus:input-primary pl-12 text-lg font-semibold"
                            required
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                </svg>
                              </div>
                              <span className="text-sm font-semibold text-base-content/70">
                                Coins
                              </span>
                            </div>
                          </div>
                        </div>
                        <label className="label">
                          <span className="label-text-alt text-base-content/60">
                            Available:{" "}
                            <span className="font-bold text-primary">
                              {totalCoins} coins
                            </span>
                          </span>
                        </label>
                      </div>

                      {/* USD Amount Display */}
                      <div className="form-control md:col-span-2">
                        <label className="label">
                          <span className="label-text font-bold text-lg">
                            You will receive
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={
                              coinToWithdraw
                                ? `$${withdrawableAmount} USD`
                                : "$0.00 USD"
                            }
                            readOnly
                            className="input input-bordered input-lg bg-success/10 border-success text-success text-lg font-bold w-full pl-12"
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <svg
                              className="w-6 h-6 text-success"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <label className="label">
                          <span className="label-text-alt text-base-content/60">
                            Conversion rate:{" "}
                            <span className="font-semibold">20 coins = $1</span>
                          </span>
                        </label>
                      </div>

                      {/* Payment System */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-bold text-lg">
                            Payment Method
                          </span>
                        </label>
                        <select
                          value={paymentSystem}
                          onChange={(e) => setPaymentSystem(e.target.value)}
                          className="select select-bordered select-primary focus:select-primary text-lg font-semibold"
                          required
                        >
                          <option value="" disabled>
                            Choose method
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
                          <span className="label-text font-bold text-lg">
                            Account Number
                          </span>
                        </label>
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="input input-bordered input-primary focus:input-primary text-lg font-semibold"
                          placeholder="Enter account number"
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        className={`btn btn-primary btn-lg w-full text-lg font-bold h-16 ${
                          isPending ? "loading" : ""
                        } ${
                          coinToWithdraw > totalCoins ||
                          !coinToWithdraw ||
                          coinToWithdraw < 200
                            ? "btn-disabled opacity-50"
                            : "shadow-2xl hover:shadow-3xl transform hover:scale-[1.02]"
                        }`}
                        disabled={
                          isPending ||
                          coinToWithdraw > totalCoins ||
                          !coinToWithdraw ||
                          coinToWithdraw < 200
                        }
                      >
                        {isPending ? (
                          <>
                            <span className="loading loading-spinner loading-md"></span>
                            Processing Withdrawal...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                              />
                            </svg>
                            Submit Withdrawal Request
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <svg
                        className="w-12 h-12 text-warning"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.181 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-base-content mb-4">
                      Minimum Balance Required
                    </h3>
                    <p className="text-base-content/70 text-lg mb-6 max-w-md mx-auto">
                      You need at least{" "}
                      <span className="font-bold text-primary">200 coins</span>{" "}
                      to make a withdrawal.
                    </p>
                    <div className="stats shadow bg-base-200 max-w-xs mx-auto mb-6">
                      <div className="stat">
                        <div className="stat-title text-base-content/70">
                          Current Balance
                        </div>
                        <div className="stat-value text-primary text-2xl">
                          {totalCoins}
                        </div>
                        <div className="stat-desc text-warning">coins</div>
                      </div>
                    </div>
                    <p className="text-base-content/60 mb-6">
                      Need{" "}
                      <span className="font-bold text-warning text-lg">
                        {200 - totalCoins} more coins
                      </span>{" "}
                      to withdraw
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button className="btn btn-primary btn-lg shadow-lg">
                        Complete More Tasks
                      </button>
                      <button className="btn btn-outline btn-primary btn-lg">
                        Earn Coins
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info Alert */}
            <div className="alert alert-info shadow-lg mt-6 border border-info/20">
              <svg
                className="w-6 h-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div>
                <h3 className="font-bold">Withdrawal Information</h3>
                <div className="text-xs">
                  Processing time: 1-3 business days. Minimum withdrawal: 200
                  coins ($10). Make sure your account details are correct as
                  withdrawals cannot be reversed.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawals;
