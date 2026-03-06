import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 bg-gray-900 text-gray-300 rounded-t-3xl overflow-hidden">
      <div className="px-6 sm:px-12 pt-12 pb-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <img src={assets.logo} className="mb-5 w-32 brightness-0 invert" alt="Logo" />
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Homemade with love — we craft authentic pickles, traditional
              powders, and handmade food using age-old family recipes and
              only the freshest ingredients.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {["📘", "📸", "🐦"].map((icon, i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-sm cursor-pointer">
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Company</p>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-400">
              {["Home", "About Us", "Delivery Info", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <span className="hover:text-[#6ee7a0] cursor-pointer transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Get In Touch</p>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-400">
              <li>📞 +91 98765 43210</li>
              <li>✉️ hello@purenature.in</li>
              <li className="mt-2 text-xs text-gray-500 leading-relaxed">
                42 Green Valley Rd, Bengaluru - 560001
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>Copyright 2027 © purenature.in — All rights reserved.</p>
          <p className="text-gray-600">Made with 🏠 love & tradition</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
