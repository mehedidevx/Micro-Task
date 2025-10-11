import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaPaperPlane,
  FaUser,
  FaComments,
  FaClock,
  FaCheckCircle,
  FaHeadset,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { MdEmail } from "react-icons/md";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
   
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: "Email Us",
      details: "support@microtask.com",
      subDetails: "info@microtask.com",
      gradient: "from-blue-500 to-cyan-500",
      action: "mailto:support@microtask.com",
    },
    {
      icon: FaPhone,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      subDetails: "Mon-Fri 9AM-6PM EST",
      gradient: "from-green-500 to-emerald-500",
      action: "tel:+15551234567",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Visit Us",
      details: "123 Business Street",
      subDetails: "New York, NY 10001",
      gradient: "from-purple-500 to-violet-500",
      action: "https://maps.google.com",
    },
    {
      icon: FaHeadset,
      title: "Live Support",
      details: "24/7 Available",
      subDetails: "Chat with our team",
      gradient: "from-orange-500 to-red-500",
      action: "#",
    },
  ];

  const socialLinks = [
    { icon: FaFacebook, name: "Facebook", color: "text-blue-600", href: "#" },
    { icon: FaTwitter, name: "Twitter", color: "text-sky-500", href: "#" },
    { icon: FaLinkedin, name: "LinkedIn", color: "text-blue-700", href: "#" },
    { icon: FaInstagram, name: "Instagram", color: "text-pink-500", href: "#" },
  ];

  const features = [
    {
      icon: FaClock,
      title: "Quick Response",
      description: "We respond within 24 hours",
    },
    {
      icon: FaHeadset,
      title: "Expert Support",
      description: "Professional assistance team",
    },
    {
      icon: FaCheckCircle,
      title: "Guaranteed Solution",
      description: "We solve your problems",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/30 to-base-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative inline-block mb-6">
            <motion.div
              className="w-24 h-24 mx-auto bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaComments className="w-12 h-12 text-white" />
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <HiSparkles className="w-4 h-4 text-white" />
            </motion.div>
          </div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Contact Us
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-base-content/70 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We're here to help you succeed. Get in touch with our amazing
            support team
          </motion.p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {contactInfo.map((info, index) => (
            <motion.a
              key={index}
              href={info.action}
              target={info.action.startsWith("http") ? "_blank" : "_self"}
              className="group bg-gradient-to-br from-base-100 to-base-200/50 backdrop-blur-xl rounded-3xl p-6  border border-base-content/10  transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${info.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
              >
                <info.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-center text-base-content mb-2 group-hover:text-primary transition-colors">
                {info.title}
              </h3>
              <p className="text-base-content/80 text-center font-medium mb-1">
                {info.details}
              </p>
              <p className="text-base-content/60 text-center text-sm">
                {info.subDetails}
              </p>
            </motion.a>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid  grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <motion.div
            className="container mx-auto bg-gradient-to-br from-base-100 to-base-200/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-base-content/10 flex flex-col h-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {/* Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-8 text-center sm:text-left">
              <div className="w-12 h-12 mx-auto sm:mx-0 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mb-4 sm:mb-0">
                <MdEmail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-base-content">
                  Send Message
                </h2>
                <p className="text-base-content/70 text-sm sm:text-base">
                  We'll get back to you soon
                </p>
              </div>
            </div>

            {/* Success Message */}
            {isSubmitted && (
              <motion.div
                className="bg-success/10 border border-success/20 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <FaCheckCircle className="w-6 h-6 text-success" />
                <div>
                  <p className="font-semibold text-success">
                    Message Sent Successfully!
                  </p>
                  <p className="text-sm text-success/80">
                    We'll respond within 24 hours.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Form - Takes full available height */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 flex-1 flex flex-col"
            >
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <FaUser className="w-4 h-4 text-primary" />
                      Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input input-bordered w-full rounded-xl bg-base-200/50 border-2 focus:border-primary focus:bg-base-100 transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <FaEnvelope className="w-4 h-4 text-primary" />
                      Email Address
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input input-bordered w-full rounded-xl bg-base-200/50 border-2 focus:border-primary focus:bg-base-100 transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaComments className="w-4 h-4 text-primary" />
                    Subject
                  </span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="input input-bordered w-full rounded-xl bg-base-200/50 border-2 focus:border-primary focus:bg-base-100 transition-all duration-300"
                  placeholder="What's this about?"
                  required
                />
              </div>

              {/* Message - Takes all remaining space */}
              <div className="form-control flex-1 flex flex-col">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaComments className="w-4 h-4 text-primary" />
                    Message
                  </span>
                </label>
                <div className="flex-1 min-h-[150px]">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered w-full h-full rounded-xl bg-base-200/50 border-2 focus:border-primary focus:bg-base-100 transition-all duration-300 resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="btn btn-primary w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300 mt-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitted}
              >
                <FaPaperPlane className="w-5 h-5 mr-2" />
                {isSubmitted ? "Message Sent!" : "Send Message"}
              </motion.button>
            </form>
          </motion.div>

          {/* Right Side Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {/* Why Contact Us */}
            <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-xl rounded-3xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold text-base-content mb-6 flex items-center gap-3">
                <FaHeadset className="w-6 h-6 text-primary" />
                Why Contact Us?
              </h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-base-100/50 rounded-xl"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base-content mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-base-content/70 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gradient-to-br from-base-100 to-base-200/50 backdrop-blur-xl rounded-3xl p-8  border border-base-content/10">
              <h3 className="text-2xl font-bold text-base-content mb-6 text-center">
                Follow Us
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="flex items-center gap-3 p-4 bg-base-100/80 border border-base-content/10  rounded-xl transition-all duration-300   group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <social.icon
                      className={`w-6 h-6 ${social.color} group-hover:scale-110 transition-transform`}
                    />
                    <span className="font-medium text-base-content group-hover:text-primary transition-colors">
                      {social.name}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map Section (Optional) */}
        <motion.div
          className="bg-gradient-to-br from-base-100 to-base-200/50 backdrop-blur-xl rounded-3xl p-8  border border-base-content/10 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
        >
          <h3 className="text-3xl font-bold text-base-content mb-4">
            Visit Our Office
          </h3>
          <p className="text-base-content/70 mb-8 max-w-2xl mx-auto">
            Come meet our team in person! We're located in the heart of the city
            with easy access to public transportation.
          </p>
          <div className="bg-base-300/50 rounded-2xl h-64 flex items-center justify-center">
            <div className="text-center">
              <FaMapMarkerAlt className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-base-content/70">
                Interactive Map Coming Soon
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
