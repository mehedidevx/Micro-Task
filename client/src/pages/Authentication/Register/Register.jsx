import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useAxios from "../../../hooks/useAxios";
import SocialLogin from "../SocialLogin/SocialLogin";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { HiSparkles } from "react-icons/hi";
import { FaEnvelope, FaLock, FaUser, FaImage, FaUsers, FaCoins, FaEye, FaEyeSlash, FaUserPlus, FaShieldAlt, FaAward, FaCheckCircle } from "react-icons/fa";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const axiosInstance = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/dashboard";
  const queryClient = useQueryClient();

  const password = watch('password');

  const onSubmit = async (data) => {
    setErrorMsg("");
    setIsLoading(true);

    try {
      const result = await createUser(data.email, data.password);

      await updateUserProfile({
        displayName: data.name,
        photoURL: profilePic,
      });

      let coin = data.role === "Worker" ? 10 : 50;

      const userInfo = {
        name: data.name,
        email: data.email,
        photo: profilePic,
        role: data.role,
        coin,
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      const res = await axiosInstance.post("/users", userInfo);
      if (res.data.insertedId) {
        queryClient.invalidateQueries({ queryKey: ["allUsers"] });
        toast.success("Registration successful! Redirecting...");
        navigate(from);
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMsg("This email is already registered.");
        toast.error("This email is already registered.");
      } else {
        setErrorMsg(error.message);
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    
    const formData = new FormData();
    formData.append("image", image);

    const uploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;
    try {
      setIsLoading(true);
      const res = await axios.post(uploadUrl, formData);
      setProfilePic(res.data.data.url);
      toast.success('Profile picture uploaded successfully!');
    } catch (err) {
      console.error("Image upload failed", err);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: FaCheckCircle, text: "Worker Signup: Get 10 Free Coins", color: "text-green-200" },
    { icon: FaCheckCircle, text: "Buyer Signup: Get 50 Free Coins", color: "text-green-200" },
    { icon: FaShieldAlt, text: "Secure & Encrypted Data", color: "text-blue-100" },
    { icon: FaAward, text: "Instant Access to Tasks", color: "text-yellow-100" }
  ];

  return (
    <div className="min-h-screen  flex items-center justify-center p-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23570DF8' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='4'/%3E%3Ccircle cx='53' cy='7' r='4'/%3E%3Ccircle cx='7' cy='53' r='4'/%3E%3Ccircle cx='53' cy='53' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 w-full container px-4">
        <div className="bg-base-100 backdrop-blur-sm rounded-3xl  overflow-hidden border border-base-content/10">
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
                  Create Your Account
                </h1>
                <p className="text-base-content/70 text-lg">
                  Join our community and start earning today
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-base-content">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      placeholder="Enter your full name"
                      className={`w-full pl-12 pr-4 py-4 border rounded-xl text-base-content placeholder:text-base-content/50 bg-base-200/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-base-100 ${
                        errors.name ? 'border-error bg-error/5' : 'border-base-300 hover:border-base-content/30'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-error text-sm flex items-center mt-1">
                      <span className="mr-2">⚠</span>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Profile Picture Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-base-content">
                    Profile Picture
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaImage className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="w-full pl-12 pr-4 py-4 border rounded-xl text-base-content placeholder:text-base-content/50 bg-base-200/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-base-100 file:border-0 file:bg-transparent file:text-sm file:font-medium"
                    />
                  </div>
                  {profilePic && (
                    <p className="text-success text-sm flex items-center mt-1">
                      <span className="mr-2">✓</span>
                      Image uploaded successfully
                    </p>
                  )}
                </div>

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
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      placeholder="Enter your email address"
                      className={`w-full pl-12 pr-4 py-4 border rounded-xl text-base-content placeholder:text-base-content/50 bg-base-200/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-base-100 ${
                        errors.email ? 'border-error bg-error/5' : 'border-base-300 hover:border-base-content/30'
                      }`}
                    />
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
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        },
                        pattern: {
                          value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/,
                          message: "Must contain uppercase, lowercase, and a number"
                        }
                      })}
                      placeholder="Create a secure password"
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

                {/* Role Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-base-content">
                    Select Your Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUsers className="h-5 w-5 text-base-content/40" />
                    </div>
                    <select
                      {...register("role", { required: "Role is required" })}
                      className={`w-full pl-12 pr-4 py-4 border rounded-xl text-base-content bg-base-200/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-base-100 ${
                        errors.role ? 'border-error bg-error/5' : 'border-base-300 hover:border-base-content/30'
                      }`}
                    >
                      <option value="">Choose your role</option>
                      <option value="Worker">Worker (Get 10 Free Coins)</option>
                      <option value="Buyer">Buyer (Get 50 Free Coins)</option>
                    </select>
                  </div>
                  {errors.role && (
                    <p className="text-error text-sm flex items-center mt-1">
                      <span className="mr-2">⚠</span>
                      {errors.role.message}
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {errorMsg && (
                  <div className="alert alert-error shadow-lg">
                    <div>
                      <svg className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{errorMsg}</span>
                    </div>
                  </div>
                )}

                {/* Register Button */}
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-primary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center shadow-lg hover:shadow-primary/50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="mr-2" />
                      Create Account
                    </>
                  )}
                </button>

                {/* Login Link */}
                <p className="text-center text-base-content/70">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="text-primary hover:text-secondary font-semibold transition-colors"
                  >
                    Sign in here
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
              </form>
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
                    Join Our Thriving Community
                  </h2>
                  <p className="text-xl text-primary-content/80 leading-relaxed">
                    Sign up today and get instant access to thousands of micro-tasks. Earn rewards, build your reputation, and grow your income.
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <FaCoins className="w-8 h-8 text-warning animate-bounce" />
                      <div>
                        <p className="text-2xl font-bold">Free Coins</p>
                        <p className="text-sm text-primary-content/80">On Signup</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <FaUsers className="w-8 h-8 text-blue-200 animate-pulse" />
                      <div>
                        <p className="text-2xl font-bold">10K+</p>
                        <p className="text-sm text-primary-content/80">Active Members</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-6 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-4 animate-slideIn" style={{ animationDelay: `${index * 0.2}s` }}>
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:scale-110 transition-transform duration-300">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-lg text-primary-content/90">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Password Requirements */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-3">Password Requirements</h3>
                  <ul className="space-y-2">
                    <li className={`flex items-center ${password?.length >= 6 ? 'text-green-200' : 'text-primary-content/70'}`}>
                      <span className="mr-2">•</span> At least 6 characters
                    </li>
                    <li className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-200' : 'text-primary-content/70'}`}>
                      <span className="mr-2">•</span> One uppercase letter
                    </li>
                    <li className={`flex items-center ${/[a-z]/.test(password) ? 'text-green-200' : 'text-primary-content/70'}`}>
                      <span className="mr-2">•</span> One lowercase letter
                    </li>
                    <li className={`flex items-center ${/\d/.test(password) ? 'text-green-200' : 'text-primary-content/70'}`}>
                      <span className="mr-2">•</span> One number
                    </li>
                  </ul>
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

export default Register;