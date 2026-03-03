import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("collection") && showSearch) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location, showSearch]);

  return showSearch && visible ? (
    <div className="bg-[#e8f5ee] py-4 px-4 sm:px-0">
      <div className="flex items-center gap-3 max-w-md mx-auto bg-white rounded-full px-4 py-2.5 shadow-sm border border-[#2d7a4f]/20 focus-within:border-[#2d7a4f] transition-colors">
        <img className="w-4 text-gray-400" src={assets.search_icon} alt="" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-transparent text-sm placeholder-gray-400"
          type="text"
          placeholder="Search products…"
          autoFocus
        />
        <button
          onClick={() => setShowSearch(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <img className="w-3" src={assets.cross_icon} alt="Close" />
        </button>
      </div>
    </div>
  ) : null;
};

export default SearchBar;
