import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { CreditCard, Lock, Coins, DollarSign, CheckCircle, ShieldCheck, Sparkles } from "lucide-react";

const CheckoutModal = ({ open, setOpen, selectedPackage }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Backend call to create PaymentIntent
      const res = await fetch("/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedPackage.price * 100 }),
      });
      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      setLoading(false);
      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        toast.success("Payment successful! 🎉");
        setOpen(false);
        // TODO: Backend e coin credit kora
      }
    } catch (error) {
      setLoading(false);
      toast.error("Payment failed. Please try again.");
    }
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      center
      classNames={{
        modal: "bg-base-100 rounded-box p-0 w-[95%] sm:w-full max-w-lg shadow-2xl mx-4 overflow-hidden",
        closeButton: "bg-base-200 hover:bg-base-300 rounded-full p-2 top-4 right-4 z-20 transition-all duration-200",
        overlay: "backdrop-blur-sm bg-black/40"
      }}
    >
      {selectedPackage && (
        <div className="relative">
          {/* Header with Gradient */}
          <div className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary p-6 sm:p-8 text-primary-content overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-sm rounded-full mb-2">
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">Secure Checkout</h2>
              <p className="text-sm sm:text-base opacity-90">Complete your purchase safely</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-5 sm:space-y-6">
            {/* Package Details Card */}
            <div className="card bg-base-200 border border-base-300 shadow-lg">
              <div className="card-body p-4 sm:p-6">
                <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Package Details
                </h3>
                
                <div className="space-y-3">
                  {/* Coins */}
                  <div className="flex justify-between items-center bg-base-100 rounded-box px-4 py-3 hover:bg-base-300 transition-colors duration-200">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-primary/10 p-2 rounded-box">
                        <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <span className="text-sm sm:text-base font-medium">Coins</span>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-primary">{selectedPackage.coins}</span>
                  </div>

                  {/* Price */}
                  <div className="flex justify-between items-center bg-base-100 rounded-box px-4 py-3 hover:bg-base-300 transition-colors duration-200">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-success/10 p-2 rounded-box">
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                      </div>
                      <span className="text-sm sm:text-base font-medium">Total Price</span>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-success">${selectedPackage.price}</span>
                  </div>

                  {/* Per Coin Rate */}
                  <div className="text-center py-2 bg-info/10 rounded-box">
                    <p className="text-xs sm:text-sm text-base-content/70">
                      Only <span className="font-bold text-info">${(selectedPackage.price / selectedPackage.coins).toFixed(3)}</span> per coin
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span>Payment Information</span>
              </div>

              {/* Card Element */}
              <div className={`card bg-base-100 border-2 transition-all duration-300 ${
                cardComplete ? 'border-success' : 'border-base-300 hover:border-primary/50'
              }`}>
                <div className="card-body p-4 sm:p-5">
                  <CardElement
                    onChange={handleCardChange}
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: 'currentColor',
                          fontFamily: 'system-ui, sans-serif',
                          '::placeholder': {
                            color: '#9ca3af',
                          },
                          iconColor: 'currentColor',
                        },
                        invalid: {
                          color: '#ef4444',
                          iconColor: '#ef4444',
                        },
                        complete: {
                          iconColor: '#10b981',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-base-content/60">
                <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Secured by Stripe • 256-bit SSL Encryption</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                className="btn btn-outline btn-error flex-1 order-2 sm:order-1 hover:btn-error hover:scale-[1.02] transition-all duration-200"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className={`btn btn-primary flex-1 order-1 sm:order-2 text-base sm:text-lg font-bold hover:btn-secondary hover:scale-[1.02] transition-all duration-200 ${
                  loading ? 'loading' : ''
                }`}
                onClick={handlePayment}
                disabled={!stripe || loading || !cardComplete}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Pay ${selectedPackage.price}
                  </span>
                )}
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-base-300">
              <div className="text-center space-y-1">
                <div className="text-success text-xl sm:text-2xl">✓</div>
                <p className="text-[10px] sm:text-xs text-base-content/60 font-medium">Secure</p>
              </div>
              <div className="text-center space-y-1">
                <div className="text-info text-xl sm:text-2xl">⚡</div>
                <p className="text-[10px] sm:text-xs text-base-content/60 font-medium">Instant</p>
              </div>
              <div className="text-center space-y-1">
                <div className="text-warning text-xl sm:text-2xl">🛡️</div>
                <p className="text-[10px] sm:text-xs text-base-content/60 font-medium">Protected</p>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center">
              <p className="text-xs text-base-content/50">
                Your payment is secured and encrypted. We never store your card details.
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CheckoutModal;