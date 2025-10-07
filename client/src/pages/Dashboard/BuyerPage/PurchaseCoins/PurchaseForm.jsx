import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import useAuth from "../../../../hooks/useAuth";
import useAxios from "../../../../hooks/useAxios";
import { useQueryClient } from "@tanstack/react-query";
import { CreditCard, Lock, Coins, DollarSign, CheckCircle, ShieldCheck, Sparkles, AlertCircle, Zap } from "lucide-react";

const PaymentForm = ({ selectedPackage, closeModal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState("");
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    setCardError(event.error ? event.error.message : "");
  };

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Create payment intent
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amount: selectedPackage.price * 100,
      });

      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      setLoading(false);

      if (result.error) {
        toast.error(result.error.message, {
          icon: "❌",
          style: {
            borderRadius: "10px",
            background: "#ef4444",
            color: "#fff",
          },
        });
      } else if (result.paymentIntent.status === "succeeded") {
        // Save payment record
        await axiosSecure.post("/payments", {
          email: user.email,
          coins: selectedPackage.coins,
          amount: selectedPackage.price * 100,
          date: new Date(),
        });

        // Update user coins
        await axiosSecure.patch("/users", {
          email: user.email,
          coins: selectedPackage.coins,
        });

        queryClient.invalidateQueries(["allUsers"]);
        
        toast.success("Payment successful! 🎉 Coins added!", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#10b981",
            color: "#fff",
          },
          duration: 4000,
        });
        
        closeModal();
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("Something went wrong! Please try again.", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#ef4444",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-2">
          <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black ">
          Confirm Purchase
        </h2>
        <p className="text-xs sm:text-sm text-base-content/60">Complete your secure transaction</p>
      </div>

      {/* Package Summary - DaisyUI Stats */}
      <div className="stats stats-vertical lg:stats-horizontal shadow-lg bg-base-200 w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Coins className="w-8 h-8" />
          </div>
          <div className="stat-title text-xs sm:text-sm">Coin Package</div>
          <div className="stat-value text-primary text-3xl sm:text-4xl">{selectedPackage.coins}</div>
          <div className="stat-desc text-xs">Digital coins</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <DollarSign className="w-8 h-8" />
          </div>
          <div className="stat-title text-xs sm:text-sm">Total Amount</div>
          <div className="stat-value text-secondary text-3xl sm:text-4xl">${selectedPackage.price}</div>
          <div className="stat-desc text-xs">${(selectedPackage.price / selectedPackage.coins).toFixed(3)} per coin</div>
        </div>
      </div>

      {/* Value Alert */}
      <div className="alert alert-info shadow-lg">
        <Sparkles className="w-5 h-5 shrink-0" />
        <div>
          <h3 className="font-bold text-sm sm:text-base">Great Value!</h3>
          <div className="text-xs">You're getting {selectedPackage.coins} coins for just ${selectedPackage.price}</div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="form-control w-full space-y-3">
        <label className="label">
          <span className="label-text font-semibold flex items-center gap-2">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Card Information
          </span>
          <span className="label-text-alt flex items-center gap-1 text-xs">
            <Lock className="w-3 h-3" />
            Secure
          </span>
        </label>

        {/* Card Input with DaisyUI styling */}
        <div className={`input input-bordered flex items-center p-4 h-auto transition-all duration-300 ${
          cardError ? 'input-error' : cardComplete ? 'input-success' : 'input-primary'
        }`}>
          <CardElement
            onChange={handleCardChange}
            className="w-full"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: 'currentColor',
                  fontFamily: 'inherit',
                  '::placeholder': {
                    color: '#9ca3af',
                  },
                },
                invalid: {
                  color: '#ef4444',
                },
                complete: {
                  color: '#10b981',
                },
              },
            }}
          />
        </div>

        {/* Error Alert */}
        {cardError && (
          <div className="alert alert-error shadow-lg">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs sm:text-sm">{cardError}</span>
          </div>
        )}

        {/* Success Alert when complete */}
        {cardComplete && !cardError && (
          <div className="alert alert-success shadow-lg">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs sm:text-sm">Card details verified ✓</span>
          </div>
        )}
      </div>

      {/* Security Badges - DaisyUI Badge Group */}
      <div className="flex flex-wrap justify-center gap-2">
        <div className="badge badge-outline badge-lg gap-1">
          <Lock className="w-3 h-3" />
          SSL Secured
        </div>
        <div className="badge badge-outline badge-lg gap-1">
          <ShieldCheck className="w-3 h-3" />
          PCI Compliant
        </div>
        <div className="badge badge-outline badge-lg gap-1">
          <Zap className="w-3 h-3" />
          Stripe
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button
          className="btn btn-outline btn-error flex-1"
          onClick={closeModal}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handlePayment}
          disabled={!stripe || loading || !cardComplete}
          className="btn btn-primary flex-1 font-bold hover:btn-secondary transition-all duration-300"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Pay ${selectedPackage.price}
            </>
          )}
        </button>
      </div>

      {/* Trust Indicators - DaisyUI Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="card bg-success/10 border border-success/20 shadow">
          <div className="card-body p-3 items-center text-center">
            <div className="text-2xl">✓</div>
            <p className="text-[10px] sm:text-xs font-semibold text-success">Secure</p>
          </div>
        </div>
        <div className="card bg-info/10 border border-info/20 shadow">
          <div className="card-body p-3 items-center text-center">
            <div className="text-2xl">⚡</div>
            <p className="text-[10px] sm:text-xs font-semibold text-info">Instant</p>
          </div>
        </div>
        <div className="card bg-warning/10 border border-warning/20 shadow">
          <div className="card-body p-3 items-center text-center">
            <div className="text-2xl">🛡️</div>
            <p className="text-[10px] sm:text-xs font-semibold text-warning">Protected</p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center">
        <p className="text-xs text-base-content/50">
          Your payment is secured and encrypted. We never store your card details.
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;