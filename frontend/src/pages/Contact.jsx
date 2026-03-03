import React from "react";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";

const Contact = () => {
  return (
    <div className="pb-16">
      <div className="text-center text-2xl pt-8 mb-10">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Store info */}
        <div className="card p-8 flex-1">
          <p className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            🏪 Our Store
          </p>
          <div className="flex flex-col gap-3 text-sm text-gray-500">
            <div className="flex items-start gap-3">
              <span className="text-base mt-0.5">📍</span>
              <p>42 Green Valley Road<br />Organic District, Bengaluru - 560001</p>
            </div>
            <div className="flex items-center gap-3">
              <span>📞</span>
              <p>+91 98765 43210</p>
            </div>
            <div className="flex items-center gap-3">
              <span>✉️</span>
              <p>hello@purenature.in</p>
            </div>
          </div>
        </div>

        {/* Partner */}
        <div className="card p-8 flex-1 bg-gradient-to-br from-[#e8f5ee] to-white border-[#2d7a4f]/20">
          <p className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
            🤝 Work With Us
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Are you an organic farmer or a natural product artisan? We'd love to
            partner with you and bring your products to more homes across India.
          </p>
          <button className="btn-primary">
            Partner With Us →
          </button>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
