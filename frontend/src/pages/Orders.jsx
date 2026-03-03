import { useContext, useEffect, useState, useCallback } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

const STATUS_CONFIG = {
  "Order Placed": { dot: "bg-blue-500", pill: "bg-blue-50 text-blue-600" },
  "Packing": { dot: "bg-yellow-500", pill: "bg-yellow-50 text-yellow-600" },
  "Shipped": { dot: "bg-purple-500", pill: "bg-purple-50 text-purple-600" },
  "Out for delivery": { dot: "bg-orange-500", pill: "bg-orange-50 text-orange-600" },
  "Delivered": { dot: "bg-green-500", pill: "bg-green-50 text-green-600" },
};

const COURIER_TRACKING_URLS = {
  "DTDC": (id) => `https://www.dtdc.in/trace.asp?trackingNumber=${id}`,
  "India Post": (id) => `https://www.indiapost.gov.in/vas/SitePages/TrackConsignment.aspx?trackId=${id}`,
};

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const loadOrderData = useCallback(
    async () => {
      try {
        if (!token) return;
        setPageLoading(true);

        const response = await axios.post(
          backendUrl + "/api/order/userorders",
          {},
          { headers: { token } },
        );

        if (response.data.success) {
          // Keep full order info (not broken down per item) for orderId/tracking access
          const allOrderItems = [];
          response.data.orders.forEach((order) => {
            order.items.forEach((item) => {
              allOrderItems.push({
                ...item,
                status: order.status,
                payment: order.payment,
                paymentMethod: order.paymentMethod,
                date: order.date,
                orderId: order.orderId || order._id?.slice(-6).toUpperCase(),
                trackingId: order.trackingId || "",
                courier: order.courier || "",
              });
            });
          });
          setOrderData(allOrderItems.reverse());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setPageLoading(false);
      }
    },
    [token, backendUrl],
  );

  useEffect(() => {
    loadOrderData();
  }, [token, loadOrderData]);

  const handleTrackOrder = (item) => {
    const getUrl = COURIER_TRACKING_URLS[item.courier];
    if (getUrl && item.trackingId) {
      window.open(getUrl(item.trackingId), "_blank", "noopener,noreferrer");
    } else if (item.trackingId) {
      // Fallback wildcard link: just search Google for the tracking ID
      window.open(`https://www.google.com/search?q=${item.trackingId}+tracking`, "_blank", "noopener,noreferrer");
    }
  };

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
            const canTrack = !!(item.trackingId && item.courier && COURIER_TRACKING_URLS[item.courier]);
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
                  {/* Order ID */}
                  {item.orderId && (
                    <p className="text-xs font-mono text-[#2d7a4f] bg-[#e8f5ee] px-2 py-0.5 rounded-md w-fit mb-1.5">
                      #{item.orderId}
                    </p>
                  )}
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
                  {/* Tracking info badge */}
                  {canTrack && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Courier:{" "}
                      <span className="text-gray-600 font-medium">{item.courier}</span>
                      {" · "}
                      <span className="font-mono text-gray-600">{item.trackingId}</span>
                    </p>
                  )}
                </div>

                {/* Status + Track */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 sm:gap-2 flex-shrink-0">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${statusCfg.pill}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                    {item.status}
                  </span>

                  {item.status === "Shipped" || item.status === "Out for delivery" ? (
                    <button
                      onClick={() => {
                        if (item.trackingId) {
                          handleTrackOrder(item);
                        } else {
                          toast.info("Tracking ID will be updated shortly.");
                        }
                      }}
                      className="border border-[#2d7a4f] text-[#2d7a4f] text-xs px-4 py-2 rounded-xl hover:bg-[#e8f5ee] transition-colors flex items-center gap-1.5 whitespace-nowrap min-w-[110px] justify-center font-medium"
                    >
                      🚚 Track Order
                    </button>
                  ) : (
                    <button
                      disabled
                      className="border border-gray-200 text-gray-300 text-xs px-4 py-2 rounded-xl cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap min-w-[110px] justify-center"
                      title="Tracking not available yet"
                    >
                      Track Order
                    </button>
                  )}
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
