import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-200 rounded-lg overflow-hidden">
      {/* Left Side - Text */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-16 px-8 sm:py-0 bg-white order-2 sm:order-1">
        <div className="text-[#414141] max-w-sm">
          <div className="flex items-center gap-2 mb-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-xs md:text-sm tracking-widest uppercase">
              Our Fresh Picks
            </p>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-4">
            Pure &amp; Natural <br /> Products
          </h1>

          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Freshly sourced organic food, spices, and natural goods — delivered
            straight to your door.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/collection"
              className="bg-black text-white text-sm px-8 py-3 text-center hover:bg-gray-800 transition-colors"
            >
              SHOP NOW
            </Link>
            <Link
              to="/about"
              className="border border-gray-400 text-gray-700 text-sm px-8 py-3 text-center hover:bg-gray-50 transition-colors"
            >
              LEARN MORE
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="w-full sm:w-1/2 order-1 sm:order-2">
        <img
          className="w-full h-56 sm:h-full object-cover"
          src={assets.hero_img}
          alt="Fresh Natural Products"
        />
      </div>
    </div>
  );
};

export default Hero;
