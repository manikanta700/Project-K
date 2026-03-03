import React from "react";

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="rounded-2xl bg-[#2d7a4f] text-white py-14 px-6 sm:px-12 text-center overflow-hidden relative my-16">
      {/* Decorative blobs */}
      <div className="absolute -top-8 -left-8 w-40 h-40 bg-white/5 rounded-full" />
      <div className="absolute -bottom-8 -right-8 w-56 h-56 bg-white/5 rounded-full" />

      <p className="relative text-2xl sm:text-3xl font-bold mb-2">
        🌿 Subscribe &amp; Get 20% Off
      </p>
      <p className="relative text-green-100 text-sm sm:text-base mt-2 mb-8 max-w-md mx-auto leading-relaxed">
        Join our community and be the first to know about fresh arrivals,
        seasonal offers, and natural living tips.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="relative flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
      >
        <input
          className="w-full flex-1 bg-white/20 text-white placeholder-green-200 border border-white/30 rounded-full px-5 py-3 text-sm outline-none focus:bg-white/30 focus:border-white transition-all"
          type="email"
          placeholder="Enter your email address"
          required
        />
        <button
          className="w-full sm:w-auto bg-white text-[#2d7a4f] font-semibold text-sm px-8 py-3 rounded-full hover:bg-green-50 active:scale-95 transition-all whitespace-nowrap"
          type="submit"
        >
          Subscribe Now
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
