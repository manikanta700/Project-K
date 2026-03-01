import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import LoadingSpinner from "../components/LoadingSpinner";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [removingId, setRemovingId] = useState(null); // tracks which item is being removed
  const [updatingId, setUpdatingId] = useState(null); // tracks which item qty is updating

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id,
          );

          if (!productData) return null;

          // Get price for this specific size
          const sizeObj = Array.isArray(productData.sizes)
            ? productData.sizes.find((s) => s.size === item.size)
            : null;
          const itemPrice = sizeObj ? sizeObj.price : productData.price;

          const itemKey = `${item._id}_${item.size}`;
          const isRemoving = removingId === itemKey;
          const isUpdating = updatingId === itemKey;

          return (
            <div
              key={index}
              className={`py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 transition-opacity ${
                isRemoving ? "opacity-40 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="flex items-start gap-6">
                <img
                  src={productData.images?.[0]}
                  className="w-16 sm:w-20"
                  alt={productData.name}
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {itemPrice}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center">
                <input
                  onChange={async (e) => {
                    const val = e.target.value;
                    if (val === "" || val === "0") return;
                    setUpdatingId(itemKey);
                    await updateQuantity(item._id, item.size, Number(val));
                    setUpdatingId(null);
                  }}
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                  type="number"
                  min="1"
                  defaultValue={item.quantity}
                  disabled={isUpdating}
                />
                {isUpdating && (
                  <span className="ml-1">
                    <LoadingSpinner size="xs" color="gray" />
                  </span>
                )}
              </div>
              <button
                onClick={async () => {
                  setRemovingId(itemKey);
                  await updateQuantity(item._id, item.size, 0);
                  setRemovingId(null);
                }}
                disabled={isRemoving}
                className="flex items-center justify-center w-8 h-8"
                title="Remove item"
              >
                {isRemoving ? (
                  <LoadingSpinner size="sm" color="gray" />
                ) : (
                  <img
                    src={assets.bin_icon}
                    className="w-4 sm:w-5"
                    alt="Remove"
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
