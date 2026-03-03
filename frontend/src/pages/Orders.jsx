import { useContext, useEffect, useState, useCallback } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

const STATUS_CONFIG = {
  "Order Placed": { dot: "bg-blue-500", pill: "bg-blue-50 text-blue-600" },
  "Packing": { dot: "bg-yellow-500", pill: "bg-yellow-50 text-yellow-600" },
  "Shipped": { dot: "bg-purple-500", pill: "bg-purple-50 text-purple-600" },
  "Out for delivery": { dot: "bg-orange-500", pill: "bg-orange-50 text-orange-600" },
  "Delivered": { dot: "bg-green-500", pill: "bg-green-50 text-green-600" },
};

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [trackingId, setTrackingId] = useState(null);

  const loadOrderData = useCallback(
    async (trackItemIndex = null) => {
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
    },
    [token, backendUrl],
  );

  useEffect(() => {
    loadOrderData();
  }, [token, loadOrderData]);

  return (
    <div className="pt-10 pb-20">
      <div className="text-2xl mb-6">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {/* Skeleton loader */}
      {pageLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 flex flex-col gap-2 mt-1">
                  <div className="h-4 w-48 bg-gray-200 rounded-lg" />
                  <div className="h-3 w-32 bg-gray-200 rounded-lg" />
                  <div className="h-3 w-40 bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : orderData.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-lg font-semibold text-gray-700 mb-1">No orders yet</p>
          <p className="text-sm text-gray-400">Your orders will appear here once placed.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orderData.map((item, index) => {
            const statusCfg = STATUS_CONFIG[item.status] || { dot: "bg-gray-400", pill: "bg-gray-50 text-gray-600" };
            return (
              <div key={index} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Image */}
                <img
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                  src={item.images?.[0]}
                  alt={item.name}
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2">
                    {item.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-sm">
                    <span className="font-bold text-[#2d7a4f]">
                      {currency}{item.price}
                    </span>
                    <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                    {item.size && (
                      <span className="text-xs bg-[#e8f5ee] text-[#2d7a4f] px-2 py-0.5 rounded-full">
                        {item.size}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-gray-400">
                    Ordered on {new Date(item.date).toDateString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Payment:{" "}
                    <span className={item.payment ? "text-green-600" : "text-red-500"}>
                      {item.payment ? "Paid" : "Pending"}
                    </span>{" "}
                    via {item.paymentMethod}
                  </p>
                </div>

                {/* Status + Track */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 sm:gap-2 flex-shrink-0">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${statusCfg.pill}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                    {item.status}
                  </span>
                  <button
                    onClick={() => loadOrderData(index)}
                    disabled={trackingId !== null}
                    className="border border-gray-200 text-gray-600 text-xs px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60 flex items-center gap-1.5 whitespace-nowrap min-w-[110px] justify-center"
                  >
                    {trackingId === index ? (
                      <>
                        <LoadingSpinner size="sm" color="black" />
                        Tracking…
                      </>
                    ) : (
                      "Track Order"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
