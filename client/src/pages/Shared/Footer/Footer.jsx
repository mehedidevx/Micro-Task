import React, { useState, useEffect } from "react";
import { FaLinkedin, FaFacebook, FaGithub, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCoins, FaTasks, FaUsers, FaArrowUp } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { Link } from "react-router-dom";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-base-300 mt-20">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border-b border-base-content/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HiSparkles className="w-6 h-6 text-primary animate-spin" />
              <h3 className="text-2xl font-bold text-base-content">Stay Updated</h3>
              <HiSparkles className="w-6 h-6 text-primary animate-spin" />
            </div>
            <p className="text-base-content/70 mb-6">
              Get the latest updates on new tasks, features, and earning opportunities!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input input-bordered flex-1 rounded-full"
              />
              <button className="btn btn-primary rounded-full px-8 hover:btn-secondary transition-all duration-300 hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-base-200">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <HiSparkles className="w-7 h-7 text-white animate-pulse" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    MicroTask
                  </h2>
                  <p className="text-xs text-base-content/60 font-medium">Earn & Complete</p>
                </div>
              </div>
              
              <p className="text-base-content/70 leading-relaxed">
                The ultimate micro-task platform connecting skilled workers with exciting opportunities. 
                Complete tasks, earn coins, and build your digital career with us.
              </p>

              {/* Stats */}
              <div className="flex justify-between max-w-xs">
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg mb-2 mx-auto">
                    <FaTasks className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-bold text-base-content">5K+</p>
                  <p className="text-xs text-base-content/60">Tasks</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-secondary/20 rounded-lg mb-2 mx-auto">
                    <FaUsers className="w-5 h-5 text-secondary" />
                  </div>
                  <p className="text-sm font-bold text-base-content">10K+</p>
                  <p className="text-xs text-base-content/60">Users</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-warning/20 rounded-lg mb-2 mx-auto">
                    <FaCoins className="w-5 h-5 text-warning" />
                  </div>
                  <p className="text-sm font-bold text-base-content">$1M+</p>
                  <p className="text-xs text-base-content/60">Paid</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
                <div className="w-2 h-6 bg-primary rounded-full"></div>
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { to: "/", label: "Home", icon: "🏠" },
                  { to: "/tasks", label: "Browse Tasks", icon: "📋" },
                  { to: "/dashboard", label: "Dashboard", icon: "📊" },
                  { to: "/about", label: "About Us", icon: "ℹ️" },
                  { to: "/contact", label: "Contact", icon: "📞" },
                  { to: "/help", label: "Help Center", icon: "❓" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      className="flex items-center gap-3 text-base-content/70 hover:text-primary transition-all duration-300 hover:translate-x-1 group"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
                <div className="w-2 h-6 bg-secondary rounded-full"></div>
                Our Services
              </h3>
              <ul className="space-y-3">
                {[
                  { label: "Data Entry Tasks", icon: "⌨️" },
                  { label: "Content Writing", icon: "✍️" },
                  { label: "Social Media Tasks", icon: "📱" },
                  { label: "Research Projects", icon: "🔍" },
                  { label: "Design Tasks", icon: "🎨" },
                  { label: "Translation Work", icon: "🌐" }
                ].map((service, index) => (
                  <li key={index} className="flex items-center gap-3 text-base-content/70 hover:text-secondary transition-colors duration-300 cursor-pointer group">
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </span>
                    {service.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="space-y-6 ">
              <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
                <div className="w-2 h-6 bg-accent rounded-full"></div>
                Get in Touch
              </h3>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-base-content/70">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content">Email</p>
                    <p className="text-sm">support@microtask.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-base-content/70">
                  <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <FaPhone className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content">Phone</p>
                    <p className="text-sm">+880 1234-567890</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-base-content/70">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <FaMapMarkerAlt className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content">Location</p>
                    <p className="text-sm">Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-base-content font-semibold mb-3">Follow Us</h4>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { icon: FaLinkedin, color: "hover:text-blue-600", href: "https://linkedin.com" },
                    { icon: FaFacebook, color: "hover:text-blue-500", href: "https://facebook.com" },
                    { icon: FaTwitter, color: "hover:text-sky-500", href: "https://twitter.com" },
                    { icon: FaInstagram, color: "hover:text-pink-500", href: "https://instagram.com" },
                    { icon: FaGithub, color: "hover:text-gray-600", href: "https://github.com" }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-10 h-10 bg-base-300 hover:bg-base-100 rounded-full flex items-center justify-center text-base-content/70 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-base-300 border-t border-base-content/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-base-content/60 text-sm">
                  © {new Date().getFullYear()} MicroTask. All rights reserved.
                </p>
                <p className="text-base-content/50 text-xs mt-1">
                  Made with ❤️ for the community
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Legal Links */}
                <div className="flex items-center gap-4 text-sm text-base-content/60 flex-wrap justify-center">
                  <Link to="/privacy" className="hover:text-primary transition-colors duration-300">
                    Privacy Policy
                  </Link>
                  <span>•</span>
                  <Link to="/terms" className="hover:text-primary transition-colors duration-300">
                    Terms of Service
                  </Link>
                  <span>•</span>
                  <Link to="/cookies" className="hover:text-primary transition-colors duration-300">
                    Cookies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={scrollToTop}
            className="btn btn-circle bg-[#00bba7] text-white btn-lg shadow-2xl transition-all duration-300 animate-bounce"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Footer;