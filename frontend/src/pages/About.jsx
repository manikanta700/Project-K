import React from "react";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.nature}
          alt="About Us"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
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
            sourced, tested, and packed to preserve its natural goodness. We
            partner directly with organic farms and local artisans to ensure
            freshness, traceability, and fair trade.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Our mission is to make clean, natural living accessible to everyone.
            We are committed to offering products that are good for you, good
            for the community, and good for the planet — with zero compromise on
            quality or transparency.
          </p>
        </div>
      </div>

      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>100% Natural & Organic:</b>
          <p className="text-gray-600">
            Every product is free from artificial preservatives, harmful
            chemicals, and synthetic additives. What you see is exactly what you
            get — pure nature in every pack.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Farm-Fresh Quality:</b>
          <p className="text-gray-600">
            We work directly with trusted organic farms and artisans to bring
            you the freshest, highest-quality food and natural products with
            full traceability from source to shelf.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Dedicated Customer Care:</b>
          <p className="text-gray-600">
            Our support team is always ready to help — whether it's finding the
            right product, tracking your order, or answering questions about
            ingredients and sourcing.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
