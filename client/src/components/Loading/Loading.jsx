import React from 'react';
import { HiSparkles } from 'react-icons/hi';
import { FaCoins, FaTasks } from 'react-icons/fa';

const Loading = ({ 
  fullScreen = true, 
  message = "Loading...", 
  size = "lg",
  variant = "modern" // modern, gradient, pulse, circle, cards
}) => {
  
  const containerClass = fullScreen 
    ? "flex items-center justify-center min-h-screen bg-gradient-to-br from-base-100 via-base-200/30 to-base-100" 
    : "flex items-center justify-center p-8";

  // Modern Variant (Default - Best for MicroTask)
  if (variant === "modern") {
    return (
      <div className={containerClass}>
        <div className="flex flex-col items-center gap-8">
          {/* Animated Logo Container */}
          <div className="relative">
            {/* Outer Ring */}
            <div className="absolute inset-0 w-32 h-32 border-4 border-primary/30 rounded-full animate-ping"></div>
            
            {/* Middle Ring */}
            <div className="absolute inset-2 w-28 h-28 border-4 border-secondary/40 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
            
            {/* Inner Logo */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
              <HiSparkles className="w-16 h-16 text-white animate-pulse relative z-10" />
            </div>
            
            {/* Floating Particles */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-warning rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-success rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute top-1/2 -right-4 w-2 h-2 bg-info rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
              MicroTask
            </h2>
            <p className="text-base-content/80 font-semibold text-lg">{message}</p>
            <p className="text-base-content/50 text-sm">Please wait a moment...</p>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-2 bg-base-300 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes loading {
            0%, 100% { width: 0%; margin-left: 0%; }
            50% { width: 100%; margin-left: 0%; }
          }
        `}</style>
      </div>
    );
  }

  // Gradient Variant
  if (variant === "gradient") {
    return (
      <div className={containerClass}>
        <div className="relative">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl animate-pulse"></div>
          
          {/* Main Card */}
          <div className="relative bg-base-100/80 backdrop-blur-xl rounded-3xl p-12 border border-base-300/50 shadow-2xl">
            <div className="flex flex-col items-center gap-6">
              {/* Spinning Gradient Circle */}
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
                <div className="absolute inset-2 bg-base-100 rounded-full flex items-center justify-center">
                  <FaTasks className="w-10 h-10 text-primary animate-pulse" />
                </div>
              </div>

              {/* Text */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-base-content mb-2">{message}</h3>
                <div className="flex gap-1 justify-center">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pulse Variant
  if (variant === "pulse") {
    return (
      <div className={containerClass}>
        <div className="flex flex-col items-center gap-6">
          {/* Pulsing Circles */}
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping"></div>
            <div className="absolute inset-4 bg-secondary/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute inset-8 bg-accent/50 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-xl">
              <FaCoins className="w-12 h-12 text-white animate-bounce" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-base-content mb-2">{message}</p>
            <p className="text-base-content/60">Won't take long...</p>
          </div>
        </div>
      </div>
    );
  }

  // Circle Variant
  if (variant === "circle") {
    return (
      <div className={containerClass}>
        <div className="flex flex-col items-center gap-6">
          {/* Rotating Circles */}
          <div className="relative w-28 h-28">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-primary rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 45}deg) translateY(-40px)`,
                  animation: `fade 1.2s linear infinite`,
                  animationDelay: `${i * 0.15}s`,
                  opacity: 0.2 + (i * 0.1)
                }}
              ></div>
            ))}
          </div>

          <p className="text-lg font-semibold text-base-content">{message}</p>
        </div>
        
        <style jsx>{`
          @keyframes fade {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // Cards Variant
  if (variant === "cards") {
    return (
      <div className={containerClass}>
        <div className="flex flex-col items-center gap-8">
          {/* Animated Cards */}
          <div className="relative w-64 h-40">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl"
                style={{
                  animation: `cardFlip 3s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                  transformOrigin: 'center',
                  zIndex: 3 - i
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <HiSparkles className="w-16 h-16 text-white opacity-50" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-base-content mb-2">{message}</h3>
            <div className="flex items-center gap-2 justify-center text-base-content/60">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm">Processing your request</span>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes cardFlip {
            0%, 100% { transform: translateY(0) rotateY(0deg); }
            25% { transform: translateY(-20px) rotateY(180deg); }
            50% { transform: translateY(0) rotateY(360deg); }
            75% { transform: translateY(-20px) rotateY(540deg); }
          }
        `}</style>
      </div>
    );
  }

  // Default fallback
  return (
    <div className={containerClass}>
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
};

export default Loading;