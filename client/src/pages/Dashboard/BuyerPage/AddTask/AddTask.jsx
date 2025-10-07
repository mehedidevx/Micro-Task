import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxios from "../../../../hooks/useAxios";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth";
import { FaUpload, FaCoins, FaUsers, FaCalendarAlt, FaInfoCircle, FaImage, FaPlusCircle } from "react-icons/fa";

const AddTask = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm();
  const [uploading, setUploading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const axios = useAxios();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const requiredWorkers = watch("required_workers");
  const payableAmount = watch("payable_amount");
  const totalCost = requiredWorkers && payableAmount ? requiredWorkers * payableAmount : 0;

  const { data: userInfo = {} } = useQuery({
    queryKey: ["user-coins", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/users/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const onSubmit = async (data) => {
    if (!imageURL) {
      toast.error("Please upload an image before submitting.");
      return;
    }

    const requiredWorkers = parseInt(data.required_workers);
    const payableAmount = parseFloat(data.payable_amount);
    const totalCost = requiredWorkers * payableAmount;

    if (userInfo.coin < totalCost) {
      toast.error("❌ You don't have enough coins to add this task.");
      return;
    }

    const taskData = {
      ...data,
      required_workers: requiredWorkers,
      payable_amount: payableAmount,
      task_image_url: imageURL,
      creator_email: userInfo?.email,
      buyer_name: userInfo?.name || "N/A",
      buyer_email: userInfo?.email || "N/A",
    };

    try {
      const taskRes = await axios.post("/tasks", taskData);

      if (taskRes.data?.insertedId) {
        await axios.patch(`/users`, {
          email: user?.email,
          coins: -totalCost,
        });

        toast.success("✅ Task added and coins deducted!");
        queryClient.invalidateQueries(["allUsers"]);
        reset();
        setImageURL("");
        navigate("/dashboard/myTasks");
      } else {
        toast.error("❌ Failed to add task.");
      }
    } catch (error) {
      console.error("Task submission error:", error);
      toast.error("❌ Failed to add task.");
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
    setUploading(true);

    try {
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const imageUrl = data?.data?.url;

      if (imageUrl) {
        setImageURL(imageUrl);
        toast.success("✅ Image uploaded successfully!");
      } else {
        toast.error("❌ Failed to get image URL!");
      }
    } catch (err) {
      console.error("Image upload failed", err);
      toast.error("❌ Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-5xl mx-auto bg-base-100/90 backdrop-blur-sm rounded-3xl  overflow-hidden border border-base-content/10 p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Create New Task
          </h2>
          <p className="text-base-content/70">
            Fill out the form below to create a new micro-task
          </p>
        </div>

        {/* Coin Balance */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-primary/20 p-3 rounded-xl mr-3">
                <FaCoins className="text-2xl text-warning" />
              </div>
              <div>
                <p className="text-sm text-base-content/70">Your Coin Balance</p>
                <p className="text-2xl font-bold text-base-content">{userInfo.coin || 0} Coins</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-base-content/70">Estimated Cost</p>
              <p className={`text-xl font-bold ${totalCost > (userInfo.coin || 0) ? 'text-error' : 'text-success'}`}>
                {totalCost} Coins
              </p>
            </div>
          </div>
          {totalCost > (userInfo.coin || 0) && (
            <p className="text-error text-sm mt-2 flex items-center">
              <span className="mr-2">⚠</span>
              You don't have enough coins for this task
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-base-content mb-2">
                Task Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter task title"
                  {...register("task_title", { required: "Task title is required" })}
                  className="w-full pl-4 pr-4 py-3 border rounded-xl text-base-content placeholder:text-base-content/50 bg-base-200/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-base-100"
                />
              </div>
              {errors.task_title && (
                <p className="text-error text-sm mt-1 flex items-center">
                  <span className="mr-2">⚠</span>
                  {errors.task_title.message}
                </p>
              )}
            </div>

            {/* Task Details */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-base-content mb-2">
                Task Details
              </label>
              <div className="relative">
                <textarea
                  placeholder="Describe the task in detail"
                  rows={4}
                  {...register("task_detail", { required: "Task detail is required" })}
                  className="w-full pl-4 pr-4 py-3 border rounded-xl text-base-content placeholder:text-base-content/50 bg-base-200/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-base-100"
                />
              </div>
              {errors.task_detail && (
                <p className="text-error text-sm mt-1 flex items-center">
                  <span className="mr-2">⚠</span>
                  {errors.task_detail.message}
                </p>
              )}
            </div>

            {/* Required Workers */}
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Required Workers
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUsers className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="number"
                  min="1"
                  placeholder="0"
                  {...register("required_workers", { required: "Number of workers is required" })}
                  className="w-full pl-12 pr-4 py-3 border rounded-xl text-base-content placeholder:text-base-content/50 bg-base-200/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-base-100"
                />
              </div>
              {errors.required_workers && (
                <p className="text-error text-sm mt-1 flex items-center">
                  <span className="mr-2">⚠</span>
                  {errors.required_workers.message}
                </p>
              )}
            </div>

            {/* Payable Amount */}
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Payable Amount (Per Worker)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaCoins className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("payable_amount", { required: "Payable amount is required" })}
                  className="w-full pl-12 pr-4 py-3 border rounded-xl text-base-content placeholder:text-base-content/50 bg-base-200/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-base-100"
                />
              </div>
              {errors.payable_amount && (
                <p className="text-error text-sm mt-1 flex items-center">
                  <span className="mr-2">⚠</span>
                  {errors.payable_amount.message}
                </p>
              )}
            </div>

            {/* Completion Date */}
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Completion Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="date"
                  {...register("completion_date", { required: "Completion date is required" })}
                  className="w-full pl-12 pr-4 py-3 border rounded-xl text-base-content bg-base-200/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-base-100"
                />
              </div>
              {errors.completion_date && (
                <p className="text-error text-sm mt-1 flex items-center">
                  <span className="mr-2">⚠</span>
                  {errors.completion_date.message}
                </p>
              )}
            </div>

            {/* Submission Info */}
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Submission Instructions
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaInfoCircle className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  placeholder="How should workers submit?"
                  {...register("submission_info", { required: "Submission info is required" })}
                  className="w-full pl-12 pr-4 py-3 border rounded-xl text-base-content placeholder:text-base-content/50 bg-base-200/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-base-100"
                />
              </div>
              {errors.submission_info && (
                <p className="text-error text-sm mt-1 flex items-center">
                  <span className="mr-2">⚠</span>
                  {errors.submission_info.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-base-content mb-2">
                Task Image
              </label>
              <div className="border-2 border-dashed border-base-300 rounded-2xl p-6 text-center transition-all duration-200 hover:border-primary/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="task-image-upload"
                />
                <label htmlFor="task-image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center">
                    {imageURL ? (
                      <>
                        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-3">
                          <FaImage className="text-2xl text-success" />
                        </div>
                        <p className="text-success font-semibold">Image Uploaded Successfully!</p>
                        <p className="text-sm text-base-content/70 mt-1">Click to change image</p>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-3">
                          {uploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/30 border-t-primary"></div>
                          ) : (
                            <FaUpload className="text-2xl text-primary" />
                          )}
                        </div>
                        <p className="font-semibold">
                          {uploading ? "Uploading Image..." : "Click to Upload Task Image"}
                        </p>
                        <p className="text-sm text-base-content/70 mt-1">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
              {!imageURL && (
                <p className="text-error text-sm mt-2 flex items-center">
                  <span className="mr-2">⚠</span>
                  Task image is required
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={uploading || totalCost > (userInfo.coin || 0)}
              className="w-full btn btn-primary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center shadow-lg hover:shadow-primary/50"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaPlusCircle className="mr-2" />
                  Create Task ({totalCost} Coins)
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;