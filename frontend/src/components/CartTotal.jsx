import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className="card p-5 w-full">
      <div className="text-xl mb-4">
        <Title text1={"ORDER"} text2={"SUMMARY"} />
      </div>
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <p>Subtotal</p>
          <p className="font-medium text-gray-800">{currency} {subtotal}</p>
        </div>
        <div className="flex justify-between text-gray-600">
          <p>Shipping Fee</p>
          <p className="font-medium text-gray-800">{currency} {delivery_fee}</p>
        </div>
        <hr className="border-gray-100" />
        <div className="flex justify-between items-center">
          <p className="font-bold text-gray-900 text-base">Total</p>
          <p className="font-bold text-[#2d7a4f] text-lg">{currency} {total}</p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
