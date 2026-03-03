import { useContext, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const inputClass =
  "w-full border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#2d7a4f] transition-colors bg-gray-50 focus:bg-white";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const {
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const [method, setMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/order/verifyRazorpay`,
            response,
            { headers: { token } },
          );
          if (data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      let orderItems = [];
      Object.keys(cartItems).forEach((itemId) => {
        Object.keys(cartItems[itemId]).forEach((size) => {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === itemId),
            );
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[itemId][size];
              orderItems.push(itemInfo);
            }
          }
        });
      });
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };
      switch (method) {
        case "cod": {
          const response = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            { headers: { token } },
          );
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }
        case "razorpay": {
          const responseRazorpay = await axios.post(
            `${backendUrl}/api/order/razorpay`,
            orderData,
            { headers: { token } },
          );
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          } else {
            toast.error(responseRazorpay.data.message);
          }
          break;
        }
        default:
          break;
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
   // { id: "stripe", label: "Stripe", logo: assets.stripe_logo },
    { id: "razorpay", label: "Razorpay", logo: assets.razorpay_logo },
    { id: "cod", label: "Cash on Delivery", logo: null },
  ];

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col lg:flex-row justify-between gap-8 pt-8 pb-20"
    >
      {/* ── Delivery Info ──────────────────────────────── */}
      <div className="flex-1">
        <div className="text-2xl mb-6">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className={inputClass} type="text" placeholder="First name" />
            <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className={inputClass} type="text" placeholder="Last name" />
          </div>
          <input required onChange={onChangeHandler} name="email" value={formData.email} className={inputClass} type="email" placeholder="Email address" />
          <input required onChange={onChangeHandler} name="street" value={formData.street} className={inputClass} type="text" placeholder="Street address" />
          <div className="flex flex-col sm:flex-row gap-3">
            <input required onChange={onChangeHandler} name="city" value={formData.city} className={inputClass} type="text" placeholder="City" />
            <input required onChange={onChangeHandler} name="state" value={formData.state} className={inputClass} type="text" placeholder="State" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} className={inputClass} type="number" placeholder="Zipcode" />
            <input required onChange={onChangeHandler} name="country" value={formData.country} className={inputClass} type="text" placeholder="Country" />
          </div>
          <input required onChange={onChangeHandler} name="phone" value={formData.phone} className={inputClass} type="number" placeholder="Phone number" />
        </div>
      </div>

      {/* ── Order Summary + Payment ─────────────────────── */}
      <div className="lg:w-96 flex flex-col gap-6">
        <CartTotal />

        {/* Payment */}
        <div className="card p-5">
          <div className="text-xl mb-4">
            <Title text1={"PAYMENT"} text2={"METHOD"} />
          </div>
          <div className="flex flex-col gap-3">
            {paymentMethods.map((pm) => (
              <button
                type="button"
                key={pm.id}
                onClick={() => setMethod(pm.id)}
                className={`flex items-center gap-3 border-2 rounded-xl p-3 transition-all cursor-pointer ${method === pm.id
                    ? "border-[#2d7a4f] bg-[#e8f5ee]"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${method === pm.id
                      ? "border-[#2d7a4f] bg-[#2d7a4f]"
                      : "border-gray-300"
                    }`}
                >
                  {method === pm.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                {pm.logo ? (
                  <img className="h-5" src={pm.logo} alt={pm.label} />
                ) : (
                  <span className="text-sm font-medium text-gray-700">
                    💵 {pm.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4 text-base justify-center rounded-xl disabled:opacity-70"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" color="white" />
              Processing…
            </>
          ) : (
            "Place Order 🎉"
          )}
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
