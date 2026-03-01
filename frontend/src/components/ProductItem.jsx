import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, inStock }) => {
  const { currency } = useContext(ShopContext);

  const productImage =
    Array.isArray(image) && image.length > 0 ? image[0] : "placeholder.jpg";

  return (
    <Link
      className="text-gray-700 cursor-pointer"
      to={id ? `/product/${id}` : "#"}
    >
      <div className="overflow-hidden relative">
        <img
          className={`hover:scale-110 transition ease-in-out w-full ${inStock === false ? "opacity-60 grayscale" : ""}`}
          src={productImage}
          alt={name || "Product"}
        />
        {inStock === false && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <p className="pt-3 pb-1 text-sm">{name || "No Name"}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">
          {currency ? `From ${currency}${price}` : "Price Not Available"}
        </p>
        {inStock === false && (
          <span className="text-xs text-red-500 font-medium">Unavailable</span>
        )}
      </div>
    </Link>
  );
};

export default ProductItem;
