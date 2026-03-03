import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import LoadingSpinner from "../components/LoadingSpinner";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [removingId, setRemovingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

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
    <div className="pt-10 pb-20">
      <div className="text-2xl mb-6">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {cartData.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-lg font-semibold text-gray-700 mb-1">Your cart is empty</p>
          <p className="text-sm text-gray-400 mb-6">Add some organic goodness!</p>
          <button onClick={() => navigate("/collection")} className="btn-primary">
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {/* Cart items */}
          <div className="flex flex-col gap-4">
            {cartData.map((item, index) => {
              const productData = products.find((p) => p._id === item._id);
              if (!productData) return null;

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
                  className={`card p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-opacity ${isRemoving ? "opacity-40 pointer-events-none" : "opacity-100"
                    }`}
                >
                  {/* Image */}
                  <img
                    src={productData.images?.[0]}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                    alt={productData.name}
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2">
                      {productData.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[#2d7a4f] font-bold text-sm">
                        {currency}{itemPrice}
                      </span>
                      <span className="text-xs bg-[#e8f5ee] text-[#2d7a4f] px-2 py-0.5 rounded-full font-medium">
                        {item.size}
                      </span>
                    </div>
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative flex items-center gap-1.5">
                      <input
                        onChange={async (e) => {
                          const val = e.target.value;
                          if (val === "" || val === "0") return;
                          setUpdatingId(itemKey);
                          await updateQuantity(item._id, item.size, Number(val));
                          setUpdatingId(null);
                        }}
                        className="border border-gray-200 rounded-lg w-16 px-2 py-2 text-center text-sm outline-none focus:border-[#2d7a4f] transition-colors"
                        type="number"
                        min="1"
                        defaultValue={item.quantity}
                        disabled={isUpdating}
                      />
                      {isUpdating && (
                        <LoadingSpinner size="xs" color="gray" />
                      )}
                    </div>

                    <button
                      onClick={async () => {
                        setRemovingId(itemKey);
                        await updateQuantity(item._id, item.size, 0);
                        setRemovingId(null);
                      }}
                      disabled={isRemoving}
                      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"
                      title="Remove item"
                    >
                      {isRemoving ? (
                        <LoadingSpinner size="sm" color="gray" />
                      ) : (
                        <img src={assets.bin_icon} className="w-4" alt="Remove" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary + checkout */}
          <div className="flex justify-end mt-10">
            <div className="w-full sm:w-[420px]">
              <CartTotal />
              <button
                onClick={() => navigate("/place-order")}
                className="btn-primary w-full mt-4 py-3.5 text-base justify-center"
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
