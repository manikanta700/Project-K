import React from "react";
import { assets } from "../assets/assets";

const policies = [
  {
    icon: assets.exchange_icon,
    title: "No Preservatives Added",
    desc: "Everything is made fresh at home — no artificial colours, chemicals, or preservatives",
    emoji: "🏠",
  },
  {
    icon: assets.quality_icon,
    title: "Freshness Guaranteed",
    desc: "Each batch is prepared fresh and packed with care to reach you at its best",
    emoji: "✅",
  },
  {
    icon: assets.support_img,
    title: "24/7 Customer Support",
    desc: "Our team is always here to help you with any questions or orders",
    emoji: "💬",
  },
];

const OurPolicy = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 py-16">
      {policies.map((p) => (
        <div
          key={p.title}
          className="card flex flex-col items-center text-center p-6 gap-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#e8f5ee] flex items-center justify-center">
            <img src={p.icon} className="w-8" alt={p.title} />
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">{p.title}</p>
            <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OurPolicy;
