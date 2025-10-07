import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { FaUser, FaEnvelope, FaCamera, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const MyProfileName = () => {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(user?.photoURL || "");
  const [preview, setPreview] = useState(user?.photoURL || "");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = () => {
    // এখানে firebase বা backend call করে update করার কাজ করতে পারো
    console.log("Name:", name);
    console.log("Photo:", photo);
    setOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-8 border border-base-300/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
            <FaUser className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
              My Profile
              <HiSparkles className="w-6 h-6 text-warning animate-pulse" />
            </h1>
            <p className="text-base-content/60 text-sm">Manage your profile information</p>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-3xl border border-base-content/10 overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-primary via-secondary to-accent relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Profile Content */}
        <div className="relative px-8 pb-8">
          {/* Profile Picture */}
          <div className="flex justify-center -mt-16 mb-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full ring-4 ring-base-100 bg-base-100 overflow-hidden ">
                <img
                  src={user?.photoURL || "https://i.ibb.co/2kR4p1V/avatar.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <FaCamera className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="text-center space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-base-content mb-2">
                {user?.displayName || "User Name Not Available"}
              </h2>
              <div className="flex items-center justify-center gap-2 text-base-content/70">
                <FaEnvelope className="w-4 h-4 text-primary" />
                <p className="text-base">{user?.email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 py-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-2xl font-bold text-base-content">0</p>
                <p className="text-sm text-base-content/60">Tasks</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-warning/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-2xl font-bold text-warning">0</p>
                <p className="text-sm text-base-content/60">Coins</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-success/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">✅</span>
                </div>
                <p className="text-2xl font-bold text-success">0</p>
                <p className="text-sm text-base-content/60">Completed</p>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setOpen(true)}
              className="btn btn-primary btn-lg rounded-2xl px-8 gap-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FaEdit className="w-5 h-5" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Additional Info Card */}
      <div className="bg-base-100 rounded-2xl border border-base-content/10 p-6 ">
        <h3 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
          <div className="w-2 h-6 bg-primary rounded-full"></div>
          Account Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-base-200 rounded-xl">
            <span className="text-base-content/70">Account Type</span>
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold">
              Standard
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-base-200 rounded-xl">
            <span className="text-base-content/70">Member Since</span>
            <span className="font-semibold text-base-content">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-base-200 rounded-xl">
            <span className="text-base-content/70">Status</span>
            <span className="px-3 py-1 bg-success/20 text-success rounded-full text-sm font-semibold">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        classNames={{
          modal: "rounded-3xl p-0 overflow-hidden max-w-lg w-full",
          closeButton: "top-4 right-4"
        }}
        open={open}
        onClose={() => setOpen(false)}
        center
      >
        <div className="bg-base-100">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 p-6 border-b border-base-300/50">
            <h3 className="text-2xl font-bold text-base-content flex items-center gap-2">
              <FaEdit className="w-6 h-6 text-primary" />
              Update Profile
            </h3>
            <p className="text-base-content/60 text-sm mt-1">
              Edit your personal information
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Photo Upload Section */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-base-300 shadow-lg mx-auto">
                  <img
                    src={preview || "https://i.ibb.co/2kR4p1V/avatar.png"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-focus transition-colors shadow-lg">
                  <FaCamera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-base-content/60 mt-3">
                Click camera icon to upload new photo
              </p>
            </div>

            {/* Name Input */}
            <div>
              <label className="text-base-content font-semibold mb-2 flex items-center gap-2">
                <FaUser className="w-4 h-4 text-primary" />
                Full Name
              </label>
              <input
                type="text"
                className="input input-bordered w-full rounded-xl focus:border-primary focus:outline-none transition-all"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email Display (Read-only) */}
            <div>
              <label className=" text-base-content font-semibold mb-2 flex items-center gap-2">
                <FaEnvelope className="w-4 h-4 text-primary" />
                Email Address
              </label>
              <input
                type="email"
                className="input input-bordered w-full rounded-xl bg-base-200 cursor-not-allowed"
                value={user?.email}
                disabled
              />
              <p className="text-xs text-base-content/60 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setOpen(false)}
                className="btn btn-ghost flex-1 rounded-xl gap-2 hover:bg-base-200"
              >
                <FaTimes className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="btn btn-primary flex-1 rounded-xl gap-2 hover:scale-105 transition-all shadow-lg"
              >
                <FaSave className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyProfileName;