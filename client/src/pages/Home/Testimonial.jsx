import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectCards } from "swiper/modules";
import { FaQuoteLeft, FaStar, FaAward, FaRocket, FaHeart, FaUsers, FaTasks, FaCoins, FaChartLine, FaShieldAlt, FaCheckCircle, FaGlobe } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-cards";

const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "Student & Freelancer",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "MicroTask helped me earn extra income while studying. The platform is incredibly user-friendly and the payment system is reliable. I've earned over 5,000 coins in just 3 months!",
    rating: 5,
    tasksCompleted: 127,
    coinsEarned: 5250,
    joinDate: "6 months ago",
    badge: "Top Performer",
    location: "Dhaka, Bangladesh",
    specialty: ["Data Entry", "Content Writing", "Research"],
    achievements: ["100+ Tasks", "Fast Worker", "Quality Expert"]
  },
  {
    name: "Tanvir Hossain",
    role: "Startup Founder",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "I found talented freelancers within minutes for my startup projects. The quality of work exceeded my expectations. Saved us both time and resources compared to traditional hiring.",
    rating: 5,
    tasksCompleted: 42,
    coinsEarned: 2100,
    joinDate: "4 months ago",
    badge: "Verified Client",
    location: "Chittagong, Bangladesh",
    specialty: ["Project Management", "Hiring", "Quality Control"],
    achievements: ["Regular Client", "Quick Payer", "5-Star Rating"]
  },
  {
    name: "Afsana Khatun",
    role: "Graphic Designer",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    quote: "Posting design tasks and getting quality work done has never been easier. The coin-based system makes transactions smooth and secure. Highly recommended for creative professionals!",
    rating: 5,
    tasksCompleted: 89,
    coinsEarned: 4450,
    joinDate: "8 months ago",
    badge: "Creative Expert",
    location: "Sylhet, Bangladesh",
    specialty: ["Logo Design", "Social Media", "Branding"],
    achievements: ["Creative Pro", "Fast Delivery", "Client Favorite"]
  },
  {
    name: "Rahim Khan",
    role: "Data Analyst",
    photo: "https://randomuser.me/api/portraits/men/67.jpg",
    quote: "The real-time analytics and progress tracking features are amazing. I can monitor my earnings and task completion rates effortlessly. Best micro-task platform I've used!",
    rating: 5,
    tasksCompleted: 156,
    coinsEarned: 7800,
    joinDate: "1 year ago",
    badge: "Data Specialist",
    location: "Khulna, Bangladesh",
    specialty: ["Data Analysis", "Excel", "Reporting"],
    achievements: ["Data Master", "Accuracy Pro", "Top Earner"]
  },
  {
    name: "Nusrat Jahan",
    role: "Content Writer",
    photo: "https://randomuser.me/api/portraits/women/26.jpg",
    quote: "As a content writer, I love the variety of tasks available. From blog posts to product descriptions, there's always something interesting to work on. The community is very supportive!",
    rating: 5,
    tasksCompleted: 203,
    coinsEarned: 10150,
    joinDate: "1.5 years ago",
    badge: "Writing Pro",
    location: "Rajshahi, Bangladesh",
    specialty: ["Blog Writing", "SEO Content", "Copywriting"],
    achievements: ["Content Guru", "SEO Expert", "Best Writer"]
  },
  {
    name: "Kamal Hossain",
    role: "Small Business Owner",
    photo: "https://randomuser.me/api/portraits/men/54.jpg",
    quote: "Perfect for outsourcing small business tasks. The platform helped me scale my operations without hiring full-time staff. The 24/7 support is exceptional!",
    rating: 5,
    tasksCompleted: 67,
    coinsEarned: 3350,
    joinDate: "3 months ago",
    badge: "Business Partner",
    location: "Barisal, Bangladesh",
    specialty: ["Business Tasks", "Admin Work", "Customer Service"],
    achievements: ["Business Pro", "Reliable", "Quick Learner"]
  }
];

const platformStats = [
  { icon: FaUsers, value: "50,000+", label: "Active Members", color: "from-blue-500 to-cyan-500" },
  { icon: FaTasks, value: "500K+", label: "Tasks Completed", color: "from-purple-500 to-pink-500" },
  { icon: FaCoins, value: "10M+", label: "Coins Earned", color: "from-orange-500 to-yellow-500" },
  { icon: FaChartLine, value: "98%", label: "Success Rate", color: "from-green-500 to-emerald-500" },
  { icon: FaGlobe, value: "120+", label: "Countries", color: "from-red-500 to-rose-500" },
  { icon: FaAward, value: "4.9/5", label: "User Rating", color: "from-indigo-500 to-purple-500" }
];

const Testimonial = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-base-100 via-base-200/30 to-base-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center shadow-2xl">
                <FaHeart className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-warning rounded-full flex items-center justify-center animate-pulse">
                <HiSparkles className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-base-content mb-6">
            Success <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Stories</span>
          </h1>
          
          <p className="text-2xl text-base-content/70 max-w-4xl mx-auto mb-12 leading-relaxed">
            Join thousands of satisfied users who are transforming their lives through MicroTask. 
            Real people, real results, real success stories from around the world.
          </p>

          {/* Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
            {platformStats.map((stat, index) => (
              <div key={index} className="bg-base-100 rounded-2xl p-6 border border-base-content/10  transition-all duration-300  group">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform mx-auto`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-2xl font-bold text-base-content text-center mb-2">{stat.value}</div>
                <div className="text-base-content/60 text-center font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Testimonials Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
              What Our <span className="text-primary">Community</span> Says
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Discover how MicroTask is making a difference in people's lives every day
            </p>
          </div>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ 
              clickable: true,
              bulletClass: "swiper-pagination-bullet bg-base-content/20",
              bulletActiveClass: "swiper-pagination-bullet-active bg-primary"
            }}
            autoplay={{ 
              delay: 5000,
              disableOnInteraction: false 
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1200: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="testimonial-swiper pb-16"
          >
           {testimonials.map((testimonial, index) => (
  <SwiperSlide key={index}>
    <div className="group cursor-pointer h-full">
      <div className="bg-base-100 rounded-3xl p-6 border border-base-content/10 transition-all duration-500 group-hover:border-primary/30 relative overflow-hidden h-full flex flex-col">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

        {/* Quote Icon */}
        <div className="absolute top-4 left-4 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors z-10">
          <FaQuoteLeft className="w-4 h-4 text-primary" />
        </div>

        {/* User Header - Fixed Height */}
        <div className="flex items-start gap-3 mb-4 relative z-10 pt-2">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-colors shadow-md">
              <img
                src={testimonial.photo}
                alt={testimonial.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border border-base-100 flex items-center justify-center shadow-sm">
              <FaCheckCircle className="w-2 h-2 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-base-content group-hover:text-primary transition-colors truncate">
              {testimonial.name}
            </h3>
            <p className="text-xs text-base-content/60 mb-1 truncate">{testimonial.role}</p>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-3 h-3 ${
                      i < testimonial.rating ? "text-warning" : "text-base-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-base-content/60">({testimonial.rating}.0)</span>
            </div>
          </div>
        </div>

        {/* Location & Badge - Compact */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-1 text-base-content/60">
            <FaGlobe className="w-3 h-3" />
            <span className="text-xs truncate max-w-[80px]">{testimonial.location}</span>
          </div>
          <div className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-2 py-1 rounded-full truncate max-w-[100px]">
            {testimonial.badge}
          </div>
        </div>

        {/* Quote - Fixed Height with Scroll */}
        <div className="mb-4 relative z-10 flex-1 min-h-[80px] max-h-[100px] overflow-y-auto">
          <blockquote className="text-sm text-base-content/80 leading-relaxed pr-2">
            "{testimonial.quote}"
          </blockquote>
        </div>

        {/* Specialty - Compact */}
        <div className="mb-4 relative z-10">
          <h4 className="font-semibold text-xs text-base-content mb-2">Specialties:</h4>
          <div className="flex flex-wrap gap-1">
            {testimonial.specialty.map((skill, skillIndex) => (
              <span
                key={skillIndex}
                className="badge badge-outline badge-xs font-medium text-base-content/70 hover:bg-primary hover:text-white transition-colors cursor-pointer truncate max-w-[80px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Grid - Compact */}
        <div className="grid grid-cols-3 gap-2 mb-4 relative z-10">
          <div className="text-center bg-base-200/50 rounded-lg p-2 backdrop-blur-sm">
            <div className="text-lg font-bold text-primary leading-none">{testimonial.tasksCompleted}</div>
            <div className="text-[10px] text-base-content/60 font-medium mt-1">Tasks</div>
          </div>
          <div className="text-center bg-base-200/50 rounded-lg p-2 backdrop-blur-sm">
            <div className="text-lg font-bold text-warning leading-none">{testimonial.coinsEarned}</div>
            <div className="text-[10px] text-base-content/60 font-medium mt-1">Coins</div>
          </div>
          <div className="text-center bg-base-200/50 rounded-lg p-2 backdrop-blur-sm">
            <div className="text-sm font-bold text-success leading-none">{testimonial.joinDate}</div>
            <div className="text-[10px] text-base-content/60 font-medium mt-1">Member</div>
          </div>
        </div>

        {/* Achievements - Compact */}
        <div className="relative z-10">
          <div className="flex flex-wrap gap-1">
            {testimonial.achievements.map((achievement, achievementIndex) => (
              <span
                key={achievementIndex}
                className="badge badge-primary badge-outline badge-xs font-medium truncate max-w-[70px]"
              >
                {achievement}
              </span>
            ))}
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-secondary/0 to-accent/0 group-hover:from-primary/5 group-hover:via-secondary/5 group-hover:to-accent/5 transition-all duration-500 rounded-3xl pointer-events-none"></div>
      </div>
    </div>
  </SwiperSlide>
))}
          </Swiper>
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-12 mb-20 border-2 border-primary/20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
              Why Users <span className="text-primary">Love</span> MicroTask
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Discover the features that make our platform the preferred choice for thousands worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaShieldAlt,
                title: "Secure Payments",
                description: "Your earnings are protected with our advanced security system"
              },
              {
                icon: FaRocket,
                title: "Fast Processing",
                description: "Get paid instantly with our quick payment processing"
              },
              {
                icon: FaUsers,
                title: "Global Community",
                description: "Join a diverse community of talented professionals"
              },
              {
                icon: FaChartLine,
                title: "Growth Opportunities",
                description: "Unlock new levels and earn more as you progress"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-base-content mb-3">{feature.title}</h3>
                <p className="text-base-content/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="text-center">
          <div className="bg-base-100 rounded-3xl p-12 lg:p-16 border border-base-content/10 border border-base-300/50">
            <div className="max-w-4xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <FaAward className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-6">
                Ready to Write Your <span className="text-primary">Success Story?</span>
              </h2>
              
              <p className="text-xl text-base-content/70 mb-8 leading-relaxed max-w-3xl mx-auto">
                Join our growing community of successful freelancers and clients. 
                Start your journey today and discover why thousands trust MicroTask for their micro-task needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                <button className="btn btn-lg bg-[#00bba7] text-white px-12 py-4 rounded-xl hover:bg-transparent hover:text-black transition-all shadow-none border-none text-lg font-bold">
                  <FaRocket className="w-6 h-6" />
                  Start Earning Now
                </button>
                <button className="btn btn-lg bg-transparent border-2 border-base-content/10 px-12 py-4 rounded-xl hover:bg-[#00bba8] hover:text-white hover:border-[#00bba8] transition-all shadow-none text-lg font-bold">
                  <FaUsers className="w-6 h-6" />
                  Join Community
                </button>
              </div>

              <div className="flex items-center justify-center gap-8 flex-wrap text-base">
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-success" />
                  <span className="font-semibold text-base-content">No Hidden Fees</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-success" />
                  <span className="font-semibold text-base-content">24/7 Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-success" />
                  <span className="font-semibold text-base-content">Instant Payouts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .testimonial-swiper {
          padding: 20px 0 80px 0;
        }
        
        .swiper-pagination {
          bottom: 20px !important;
        }
        
        .swiper-pagination-bullet {
          width: 14px;
          height: 14px;
          opacity: 1;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active {
          transform: scale(1.3);
        }
      `}</style>
    </section>
  );
};

export default Testimonial;