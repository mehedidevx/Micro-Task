import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaCoins, FaTasks, FaUsers, FaStar, FaShieldAlt, FaClock, FaAward } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

const Login = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/dashboard';
  
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const email = watch('email');
  const password = watch('password');

  const onSubmit = data => {
    setLoginError('');
    setIsLoading(true);
    
    signIn(data.email, data.password)
      .then(result => {
        console.log(result.user);
        toast.success('Welcome back! Login successful!');
        navigate(from, { replace: true });
      })
      .catch(error => {
        console.error(error);
        setLoginError('Invalid email or password.');
        toast.error('Login failed. Please check your credentials.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const features = [
    { icon: FaTasks, text: "5,000+ Active Tasks Daily", color: "text-blue-100" },
    { icon: FaShieldAlt, text: "100% Secure Payments", color: "text-blue-100" },
    { icon: FaClock, text: "24/7 Support Available", color: "text-blue-100" },
    { icon: FaAward, text: "Verified Task Creators Only", color: "text-blue-100" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23570DF8' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='4'/%3E%3Ccircle cx='53' cy='7' r='4'/%3E%3Ccircle cx='7' cy='53' r='4'/%3E%3Ccircle cx='53' cy='53' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}/>
      </div>

      <div className="relative z-10 w-full max-w-7xl">
        <div className="bg-base-100/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-base-content/10">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Section - Form */}
            <div className="flex-1 p-8 md:p-12 lg:p-16">
              
              {/* Logo and Brand */}
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg mr-3">
                  <HiSparkles className="w-6 h-6 text-white animate-pulse" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  MicroTask
                </span>
              </div>

              {/* Welcome Section */}
              <div className="mb-10">
                <h1 className="text-4xl font-bold text-base-content mb-3">
                  Welcome Back!
                </h1>
                <p className="text-base-content/70 text-lg">
                  Sign in to your account and continue earning
                </p>
              </div>

              {/* Form */}
              <div className="space-y-6">
                
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-base-content">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      placeholder="Enter your email address"
                      className={`w-full pl-12 pr-4 py-4 border rounded-xl text-base-content placeholder:text-base-content/50 bg-base-200/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-base-100 ${
                        errors.email ? 'border-error bg-error/5' : 'border-base-300 hover:border-base-content/30'
                      }`}
                    />
                    {email && !errors.email && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-error text-sm flex items-center mt-1">
                      <span className="mr-2">⚠</span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-base-content">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      placeholder="Enter your password"
                      className={`w-full pl-12 pr-12 py-4 border rounded-xl text-base-content placeholder:text-base-content/50 bg-base-200/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-base-100 ${
                        errors.password ? 'border-error bg-error/5' : 'border-base-300 hover:border-base-content/30'
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-base-content/40 hover:text-base-content/60 transition-colors" />
                      ) : (
                        <FaEye className="h-5 w-5 text-base-content/40 hover:text-base-content/60 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-error text-sm flex items-center mt-1">
                      <span className="mr-2">⚠</span>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Login Error */}
                {loginError && (
                  <div className="alert alert-error shadow-lg">
                    <div>
                      <svg className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{loginError}</span>
                    </div>
                  </div>
                )}

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <Link 
                    to="/forgot-password" 
                    className="text-primary hover:text-secondary font-semibold transition-colors text-sm"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Login Button */}
                <button 
                  onClick={handleSubmit(onSubmit)}
                  type="submit" 
                  disabled={isLoading}
                  className="w-full btn btn-primary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center shadow-lg hover:shadow-primary/50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="mr-2" />
                      Sign in to your account
                    </>
                  )}
                </button>

                {/* Sign Up Link */}
                <p className="text-center text-base-content/70">
                  Don't have an account?{" "}
                  <Link 
                    state={{ from }} 
                    to="/register" 
                    className="text-primary hover:text-secondary font-semibold transition-colors"
                  >
                    Create one here
                  </Link>
                </p>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-base-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-base-100 text-base-content/60 font-medium">Or continue with</span>
                  </div>
                </div>

                {/* Social Login */}
                <SocialLogin />
              </div>
            </div>

            {/* Right Section - Visual */}
            <div className="flex-1 bg-gradient-to-br from-primary to-secondary relative overflow-hidden hidden lg:flex flex-col justify-center p-16">
              
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M0 0l100 100M100 0L0 100' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
                }}/>
              </div>

              {/* Content */}
              <div className="relative z-10 text-white">
                <div className="mb-12">
                  <h2 className="text-4xl font-bold mb-4 leading-tight">
                    Your Success, Our Mission
                  </h2>
                  <p className="text-xl text-primary-content/80 leading-relaxed">
                    Join thousands of workers earning daily through micro-tasks. Complete simple jobs, build your reputation, and grow your income.
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <FaCoins className="w-8 h-8 text-warning animate-bounce" />
                      <div>
                        <p className="text-2xl font-bold">₹1M+</p>
                        <p className="text-sm text-primary-content/80">Total Paid</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <FaUsers className="w-8 h-8 text-blue-200 animate-pulse" />
                      <div>
                        <p className="text-2xl font-bold">10K+</p>
                        <p className="text-sm text-primary-content/80">Active Users</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-4 animate-slideIn" style={{ animationDelay: `${index * 0.2}s` }}>
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:scale-110 transition-transform duration-300">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-lg text-primary-content/90">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Call to Action */}
                <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-2">Ready to Start Earning?</h3>
                  <p className="text-primary-content/80 mb-4">Join our community and discover new opportunities every day.</p>
                  <div className="flex items-center gap-2">
                    <FaStar className="w-5 h-5 text-warning" />
                    <FaStar className="w-5 h-5 text-warning" />
                    <FaStar className="w-5 h-5 text-warning" />
                    <FaStar className="w-5 h-5 text-warning" />
                    <FaStar className="w-5 h-5 text-warning" />
                    <span className="ml-2 font-semibold">4.9/5 User Rating</span>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute -top-16 -left-16 w-48 h-48 bg-accent/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Login;