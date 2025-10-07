import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PurchaseForm";
import { Coins, Sparkles, TrendingUp, Crown, Zap, Gift, Users, Shield, Clock } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const PurchaseCard = () => {
  const coinPackages = [
    { 
      coins: 10, 
      price: 1, 
      badge: "Starter",
      popular: false,
      gradient: "from-primary to-primary/80",
      icon: Sparkles,
      savings: null
    },
    { 
      coins: 150, 
      price: 10, 
      badge: "Popular",
      popular: true,
      gradient: "from-secondary to-accent",
      icon: TrendingUp,
      savings: "33% OFF"
    },
    { 
      coins: 500, 
      price: 20, 
      badge: "Great Value",
      popular: false,
      gradient: "from-warning to-warning/80",
      icon: Zap,
      savings: "60% OFF"
    },
    { 
      coins: 1000, 
      price: 35, 
      badge: "Best Deal",
      popular: false,
      gradient: "from-success to-success/80",
      icon: Crown,
      savings: "65% OFF"
    },
  ];

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [open, setOpen] = useState(false);

  const handleCardClick = (pkg) => {
    setSelectedPackage(pkg);
    setOpen(true);
  };

  return (
    <div className="min-h-screen  px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Coins className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Choose Your Perfect Package
          </h2>
          <p className="text-base-content/70 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Unlock amazing features with our coin packages. The more you buy, the more you save!
          </p>
        </div>

        {/* Cards Grid - Fully Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {coinPackages.map((pkg, index) => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.coins}
                className={`relative group ${
                  pkg.popular ? 'sm:scale-105 xl:scale-110 transform-gpu' : ''
                }`}
                onClick={() => handleCardClick(pkg)}
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-1  rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500 `}></div>
                
                {/* Main Card */}
                <div className={`relative card bg-base-100   transition-all duration-300 cursor-pointer overflow-hidden h-full border border-base-300 `}>
                  
                  

                  {/* Savings Badge */}
                  {pkg.savings && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="badge badge-success badge-lg font-bold px-3 py-4 shadow-lg">
                        {pkg.savings}
                      </div>
                    </div>
                  )}

                  <div className={`card-body items-center text-center p-6 lg:p-8 ${
                    pkg.popular ? 'pt-12 lg:pt-14' : 'pt-6 lg:pt-8'
                  }`}>
                    {/* Animated Icon */}
                    <div className="relative mb-6">
                      <div className={`absolute inset-0 bg-gradient-to-br ${pkg.gradient} blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
                      <div className={`relative bg-gradient-to-br ${pkg.gradient} p-4 rounded-2xl text-base-100 shadow-xl group-hover:scale-110 transition-all duration-300`}>
                        <Icon className="w-8 h-8 lg:w-10 lg:h-10" />
                      </div>
                    </div>

                    {/* Package Badge */}
                    <div className={`badge ${
                      pkg.popular ? 'badge-primary' : 'badge-outline'
                    } badge-lg mb-3 font-semibold`}>
                      {pkg.badge}
                    </div>

                    {/* Coin Amount */}
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black text-base-content">
                        {pkg.coins}
                      </h3>
                      <Coins className="w-6 h-6 text-primary mb-3" />
                    </div>
                    <p className="text-sm font-medium text-base-content/60 mb-4">
                      Coins
                    </p>

                    {/* Divider */}
                    <div className="divider my-2"></div>

                    {/* Price */}
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary">
                          ${pkg.price}
                        </span>
                      </div>
                      <p className="text-sm text-base-content/50 mt-2">
                        ${(pkg.price / pkg.coins).toFixed(3)} per coin
                      </p>
                    </div>

                    {/* CTA Button */}
                    <button className={`btn ${
                      pkg.popular ? 'btn-primary' : 'btn-outline btn-primary'
                    } btn-block mt-6 font-bold group-hover:scale-105 transition-transform duration-300`}>
                      Purchase Now
                      <Gift className="w-4 h-4 ml-2" />
                    </button>
                  </div>

                  {/* Bottom Gradient Line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${pkg.gradient} group-hover:h-1.5 transition-all duration-300`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 lg:mb-16">
          <div className="card bg-base-100 border border-base-content/10">
            <div className="card-body p-6">
              <div className="flex items-start gap-4">
                <div className="bg-success/10 p-3 rounded-box">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="card-title text-lg mb-2">Secure Payment</h3>
                  <p className="text-base-content/60">256-bit SSL encrypted transactions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-content/10">
            <div className="card-body p-6">
              <div className="flex items-start gap-4">
                <div className="bg-info/10 p-3 rounded-box">
                  <Zap className="w-6 h-6 text-info" />
                </div>
                <div>
                  <h3 className="card-title text-lg mb-2">Instant Delivery</h3>
                  <p className="text-base-content/60">Coins credited immediately</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-content/10">
            <div className="card-body p-6">
              <div className="flex items-start gap-4">
                <div className="bg-warning/10 p-3 rounded-box">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h3 className="card-title text-lg mb-2">24/7 Support</h3>
                  <p className="text-base-content/60">We're here to help anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section - Mobile Optimized */}
        <div className="stats stats-vertical lg:stats-horizontal  w-full bg-base-100 border border-base-content/10">
          <div className="stat place-items-center py-6 lg:py-8">
            <div className="stat-figure text-primary">
              <Users className="w-8 h-8" />
            </div>
            <div className="stat-title text-sm lg:text-base">Total Users</div>
            <div className="stat-value text-primary text-3xl lg:text-4xl">50K+</div>
            <div className="stat-desc text-xs lg:text-sm">Active members</div>
          </div>
          
          <div className="stat place-items-center py-6 lg:py-8">
            <div className="stat-figure text-secondary">
              <Coins className="w-8 h-8" />
            </div>
            <div className="stat-title text-sm lg:text-base">Transactions</div>
            <div className="stat-value text-secondary text-3xl lg:text-4xl">1M+</div>
            <div className="stat-desc text-xs lg:text-sm">Completed safely</div>
          </div>
          
          <div className="stat place-items-center py-6 lg:py-8">
            <div className="stat-figure text-accent">
              <Crown className="w-8 h-8" />
            </div>
            <div className="stat-title text-sm lg:text-base">Rating</div>
            <div className="stat-value text-accent text-3xl lg:text-4xl">4.9★</div>
            <div className="stat-desc text-xs lg:text-sm">Customer satisfaction</div>
          </div>
        </div>
      </div>

      {/* DaisyUI Modal */}
      <dialog className={`modal ${open ? 'modal-open' : ''}`}>
        <div className="modal-box bg-base-100 p-6 max-w-2xl  w-[95%] mx-auto shadow-2xl border border-base-300">
          <form method="dialog">
            <button 
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </form>
          
          {selectedPackage && (
            <Elements stripe={stripePromise}>
              <PaymentForm
                selectedPackage={selectedPackage}
                closeModal={() => setOpen(false)}
              />
            </Elements>
          )}
        </div>
        
        {/* Modal Backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default PurchaseCard;