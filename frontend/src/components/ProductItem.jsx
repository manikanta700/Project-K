import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";

const ProductItem = ({ id, image, name, price, inStock, sizes }) => {
  const { currency, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [showSizes, setShowSizes] = useState(false);

  const productImage =
    Array.isArray(image) && image.length > 0 ? image[0] : "placeholder.jpg";

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
    <div className="relative text-gray-700 flex flex-col group">
      {/* Product Image — click goes to product page */}
      <Link to={id ? `/product/${id}` : "#"} className="block">
        <div className="overflow-hidden relative rounded-md bg-gray-50">
          <img
            className={`w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105 ${
              inStock === false ? "opacity-50 grayscale" : ""
            }`}
            src={productImage}
            alt={name || "Product"}
          />

          {/* Out of Stock overlay */}
          {inStock === false && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Name & Price */}
        <div className="mt-2 px-1">
          <p className="text-sm font-medium leading-tight line-clamp-2">
            {name || "No Name"}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            {inStock === false ? (
              <span className="text-red-400 text-xs">Unavailable</span>
            ) : (
              <>
                <span className="text-xs text-gray-400 mr-0.5">From</span>
                <span className="font-semibold text-gray-800">
                  {currency}
                  {price}
                </span>
              </>
            )}
          </p>
        </div>
      </Link>

      {/* Action Buttons — only when inStock */}
      {inStock !== false && (
        <div className="mt-2 px-1">
          {!showSizes ? (
            /* Collapsed: show Add to Cart button */
            <button
              onClick={handleToggleSizes}
              className="w-full bg-black text-white text-xs py-2 rounded hover:bg-gray-800 active:scale-95 transition-all"
            >
              🛒 Add to Cart
            </button>
          ) : (
            /* Expanded: show size + action buttons */
            <div className="border border-gray-200 rounded-md p-2 bg-white shadow-sm">
              <p className="text-xs text-gray-500 mb-1.5 font-medium">
                Select Pack:
              </p>

              {/* Size options */}
              <div className="flex flex-wrap gap-1 mb-2">
                {Array.isArray(sizes) && sizes.length > 0 ? (
                  sizes.map((s) => (
                    <div key={s.size} className="flex flex-col gap-1 w-full">
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => handleAddToCart(e, s.size)}
                          className="flex-1 border border-gray-300 rounded text-xs py-1.5 px-2 hover:bg-black hover:text-white hover:border-black transition-all text-left"
                        >
                          <span className="font-medium">{s.size}</span>
                          <span className="text-gray-400 ml-1">
                            — {currency}
                            {s.price}
                          </span>
                        </button>
                        <button
                          onClick={(e) => handleBuyNow(e, s.size)}
                          className="border border-green-500 text-green-600 rounded text-xs py-1.5 px-2 hover:bg-green-500 hover:text-white transition-all whitespace-nowrap"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">
                    No sizes available. View product.
                  </p>
                )}
              </div>

              {/* Cancel */}
              <button
                onClick={handleToggleSizes}
                className="text-xs text-gray-400 hover:text-gray-600 w-full text-center mt-1"
              >
                ✕ Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Out of stock: View Details link */}
      {inStock === false && (
        <div className="mt-2 px-1">
          <Link
            to={`/product/${id}`}
            className="w-full block text-center border border-gray-300 text-gray-500 text-xs py-2 rounded hover:bg-gray-50"
          >
            View Details
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductItem;
