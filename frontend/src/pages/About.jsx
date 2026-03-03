import React from "react";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";
import { assets } from "../assets/assets";

const whyChooseUs = [
  {
    emoji: "🌿",
    title: "100% Natural & Organic",
    desc: "Every product is free from artificial preservatives, harmful chemicals, and synthetic additives. What you see is exactly what you get — pure nature in every pack.",
  },
  {
    emoji: "🚜",
    title: "Farm-Fresh Quality",
    desc: "We work directly with trusted organic farms and artisans to bring you the freshest, highest-quality food and natural products with full traceability from source to shelf.",
  },
  {
    emoji: "💬",
    title: "Dedicated Customer Care",
    desc: "Our support team is always ready to help — whether it's finding the right product, tracking your order, or answering questions about ingredients and sourcing.",
  },
];

const About = () => {
  return (
    <div className="pb-16">
      <div className="text-2xl text-center pt-8 mb-12">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      {/* Story section */}
      <div className="flex flex-col md:flex-row gap-10 mb-16">
        <img
          className="w-full md:max-w-[420px] rounded-2xl object-cover"
          src={assets.nature}
          alt="About Us"
        />
        <div className="flex flex-col justify-center gap-5 text-gray-600 text-sm sm:text-base leading-relaxed">
          <p>
            PureNature was founded with a simple belief — that what you put into
            your body and onto your skin should be as pure and natural as
            possible. We started as a small collective of farmers and artisans
            passionate about bringing honest, chemical-free products directly to
            your home.
          </p>
          <p>
            From cold-pressed oils and sun-dried spices to handcrafted natural
            soaps and herbal teas, every product in our store is carefully
            sourced, tested, and packed to preserve its natural goodness.
          </p>
          <div className="card p-5 bg-[#e8f5ee] border-[#2d7a4f]/20">
            <p className="font-bold text-[#2d7a4f] mb-1">🎯 Our Mission</p>
            <p className="text-gray-600 text-sm">
              To make clean, natural living accessible to everyone — with zero
              compromise on quality or transparency.
            </p>
          </div>
        </div>
      </div>

      {/* Why choose us */}
      <div className="mb-12">
        <div className="text-xl mb-6">
          <Title text1={"WHY"} text2={"CHOOSE US"} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {whyChooseUs.map((item) => (
            <div key={item.title} className="card p-6 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="text-3xl">{item.emoji}</div>
              <p className="font-bold text-gray-800">{item.title}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
