import React, { useContext, useState, useRef, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";

const ProductItem = ({ id, image, name, price, inStock, sizes }) => {
  const { currency, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [showSizes, setShowSizes] = useState(false);
  const dropdownRef = useRef(null);

  const productImage =
    Array.isArray(image) && image.length > 0 ? image[0] : "placeholder.jpg";

  // Close the dropdown when clicking outside
  useEffect(() => {
    if (!showSizes) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSizes(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSizes]);

  const handleAddToCart = (e, sizeName) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id, sizeName);
    setShowSizes(false);
  };

  const handleBuyNow = (e, sizeName) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id, sizeName);
    navigate("/cart");
  };

  const handleToggleSizes = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSizes((prev) => !prev);
  };

  return (
    <div className="card flex flex-col group overflow-visible transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Product Image */}
      <Link to={id ? `/product/${id}` : "#"} className="block">
        <div className="relative overflow-hidden bg-[#f5f5f0] rounded-t-2xl">
          <img
            className={`w-full h-44 sm:h-52 object-cover transition-transform duration-300 group-hover:scale-105 ${inStock === false ? "opacity-40 grayscale" : ""
              }`}
            src={productImage}
            alt={name || "Product"}
          />

          {/* Stock badges */}
          {inStock === false ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Out of Stock
              </span>
            </div>
          ) : (
            <span className="absolute top-2 left-2 bg-[#2d7a4f] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              In Stock
            </span>
          )}
        </div>

        {/* Name & Price */}
        <div className="px-3 pt-3 pb-1">
          <p className="text-sm font-semibold leading-tight line-clamp-2 text-gray-800">
            {name || "No Name"}
          </p>
          <p className="text-sm mt-1">
            {inStock === false ? (
              <span className="text-red-400 text-xs">Unavailable</span>
            ) : (
              <>
                <span className="text-xs text-gray-400 mr-0.5">From</span>
                <span className="font-bold text-[#2d7a4f]">
                  {currency}{price}
                </span>
              </>
            )}
          </p>
        </div>
      </Link>

      {/* Action area */}
      <div className="px-3 pb-3 mt-auto relative" ref={dropdownRef}>
        {inStock !== false ? (
          <>
            <button
              onClick={handleToggleSizes}
              className="w-full bg-[#2d7a4f] text-white text-xs py-2.5 rounded-xl hover:bg-[#235f3d] active:scale-95 transition-all font-medium mt-2"
            >
              🛒 Add to Cart
            </button>

            {/* ── Floating size picker — absolutely positioned so it doesn't push the grid ── */}
            {showSizes && (
              <div className="absolute bottom-full left-0 right-0 mb-2 z-50 border border-gray-200 rounded-xl p-3 bg-white shadow-xl">
                <p className="text-xs text-gray-500 mb-2 font-semibold">
                  Select Pack:
                </p>
                <div className="flex flex-col gap-1.5">
                  {Array.isArray(sizes) && sizes.length > 0 ? (
                    sizes.map((s) => (
                      <div key={s.size} className="flex gap-1.5">
                        <button
                          onClick={(e) => handleAddToCart(e, s.size)}
                          className="flex-1 border border-gray-200 rounded-lg text-xs py-2 px-2 hover:bg-[#2d7a4f] hover:text-white hover:border-[#2d7a4f] transition-all text-left bg-white"
                        >
                          <span className="font-semibold">{s.size}</span>
                          <span className="text-gray-400 ml-1">
                            — {currency}{s.price}
                          </span>
                        </button>
                        <button
                          onClick={(e) => handleBuyNow(e, s.size)}
                          className="border border-[#2d7a4f] text-[#2d7a4f] rounded-lg text-xs py-2 px-2.5 hover:bg-[#2d7a4f] hover:text-white transition-all whitespace-nowrap bg-white"
                        >
                          Buy
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">
                      No sizes available. View product.
                    </p>
                  )}
                </div>
                <button
                  onClick={handleToggleSizes}
                  className="text-xs text-gray-400 hover:text-gray-600 w-full text-center mt-2"
                >
                  ✕ Cancel
                </button>
              </div>
            )}
          </>
        ) : (
          <Link
            to={`/product/${id}`}
            className="w-full block text-center border border-gray-200 text-gray-500 text-xs py-2.5 rounded-xl hover:bg-gray-50 mt-2"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
