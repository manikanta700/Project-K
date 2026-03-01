import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

const STATUS_DOT = {
  "Order Placed": "bg-blue-500",
  Packing: "bg-yellow-500",
  Shipped: "bg-purple-500",
  "Out for delivery": "bg-orange-500",
  Delivered: "bg-green-500",
};

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [trackingId, setTrackingId] = useState(null); // which item's track btn is loading

  const loadOrderData = async (trackItemIndex = null) => {
    try {
      if (!token) return;

      if (trackItemIndex !== null) setTrackingId(trackItemIndex);
      else setPageLoading(true);

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } },
      );

      if (response.data.success) {
        let allOrderItems = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            allOrderItems.push(item);
          });
        });
        setOrderData(allOrderItems.reverse());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
      setTrackingId(null);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {/* Initial page loading skeleton */}
      {pageLoading ? (
        <div className="flex flex-col gap-4 mt-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="py-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-pulse"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 sm:w-20 h-20 bg-gray-200 rounded" />
                <div className="flex flex-col gap-2 mt-1">
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-32 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="flex justify-between md:w-1/2 items-center">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-9 w-28 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : orderData.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-lg font-medium text-gray-500">No orders yet</p>
          <p className="text-sm mt-1">
            Your orders will appear here once placed.
          </p>
        </div>
      ) : (
        <div>
          {orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img
                  className="w-16 sm:w-20 object-cover rounded"
                  src={item.images?.[0]}
                  alt={item.name}
                />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                    <p>
                      {currency}
                      {item.price}
                    </p>
                    <p>Qty: {item.quantity}</p>
                    {item.size && <p>Pack: {item.size}</p>}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Ordered on <span>{new Date(item.date).toDateString()}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    Payment:{" "}
                    <span
                      className={
                        item.payment ? "text-green-600" : "text-red-500"
                      }
                    >
                      {item.payment ? "Paid" : "Pending"}{" "}
                    </span>
                    via {item.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="md:w-1/2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span
                    className={`min-w-2 h-2 w-2 rounded-full ${
                      STATUS_DOT[item.status] || "bg-gray-400"
                    }`}
                  />
                  <p className="text-sm md:text-base font-medium">
                    {item.status}
                  </p>
                </div>

                <button
                  onClick={() => loadOrderData(index)}
                  disabled={trackingId !== null}
                  className="border px-4 py-2 text-sm font-medium rounded-sm flex items-center gap-2 disabled:opacity-60 hover:bg-gray-50 transition-colors min-w-[120px] justify-center"
                >
                  {trackingId === index ? (
                    <>
                      <LoadingSpinner size="sm" color="black" />
                      Tracking...
                    </>
                  ) : (
                    "Track Order"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
