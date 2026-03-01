import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
      <div>
        <img
          src={assets.exchange_icon}
          className="w-12 m-auto mb-5"
          alt="100% Natural"
        />
        <p className="font-semibold">100% Natural & Organic</p>
        <p className="text-gray-400">
          All products are naturally sourced with no harmful chemicals
        </p>
      </div>
      <div>
        <img
          src={assets.quality_icon}
          className="w-12 m-auto mb-5"
          alt="Quality Guarantee"
        />
        <p className="font-semibold">Fresh Quality Guarantee</p>
        <p className="text-gray-400">
          We ensure every product meets our strict freshness standards
        </p>
      </div>
      <div>
        <img
          src={assets.support_img}
          className="w-12 m-auto mb-5"
          alt="24/7 Support"
        />
        <p className="font-semibold">24/7 Customer Support</p>
        <p className="text-gray-400">
          Our team is always here to help you with any queries
        </p>
      </div>
    </div>
  );
};

export default OurPolicy;
