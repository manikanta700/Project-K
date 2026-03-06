import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative flex flex-col sm:flex-row rounded-2xl overflow-hidden bg-gradient-to-br from-[#e8f5ee] via-[#f4fbf6] to-[#fdf9f0] min-h-[420px] sm:min-h-[480px]">
      {/* Decorative blobs */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#2d7a4f]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-yellow-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Left Side — Text */}
      <div className="relative w-full sm:w-1/2 flex items-center justify-center py-12 px-8 sm:py-0 order-2 sm:order-1 z-10">
        <div className="text-[#1a1a1a] max-w-sm w-full">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-[#2d7a4f]/10 text-[#2d7a4f] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            <span>🏠</span> Homemade · Traditional · Fresh
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-gray-900">
            Taste of Home, <br />
            <span className="text-[#2d7a4f]">Delivered Fresh</span>
          </h1>

          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Authentic homemade pickles, traditional powders, and handcrafted
            food — made with love, packed with flavour, delivered to your door.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/collection" className="btn-primary text-center justify-center">
              🛒 Shop Now
            </Link>
            <Link to="/about" className="btn-outline text-center justify-center">
              Our Story
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-5 mt-8 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 bg-[#e8f5ee] rounded-full flex items-center justify-center text-[10px]">✓</span>
              No Preservatives
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 bg-[#e8f5ee] rounded-full flex items-center justify-center text-[10px]">✓</span>
              Free Delivery
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 bg-[#e8f5ee] rounded-full flex items-center justify-center text-[10px]">✓</span>
              24/7 Support
            </div>
          </div>
        </div>
      </div>

      {/* Right Side — Image */}
      <div className="relative w-full sm:w-1/2 order-1 sm:order-2 flex items-center justify-center min-h-[220px] sm:min-h-0">
        <img
          className="w-full h-full object-contain max-h-[300px] sm:max-h-none sm:scale-110 sm:-translate-y-2 drop-shadow-lg"
          src={assets.baner}
          alt="Homemade Food Products"
        />
      </div>
    </section>
  );
};

export default Hero;
