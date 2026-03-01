import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const STATUS_OPTIONS = [
  "All",
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
];

const STATUS_STYLES = {
  "Order Placed": "bg-blue-100 text-blue-700 border-blue-300",
  Packing: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Shipped: "bg-purple-100 text-purple-700 border-purple-300",
  "Out for delivery": "bg-orange-100 text-orange-700 border-orange-300",
  Delivered: "bg-green-100 text-green-700 border-green-300",
};

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        // Newest orders first
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success("Order status updated");
        // Update locally for instant feedback
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: event.target.value } : o,
          ),
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Count orders per status for tab badges
  const statusCounts = useMemo(() => {
    const counts = { All: orders.length };
    STATUS_OPTIONS.slice(1).forEach((s) => {
      counts[s] = orders.filter((o) => o.status === s).length;
    });
    return counts;
  }, [orders]);

  // Filter by selected status tab + search query
  const filteredOrders = useMemo(() => {
    let result = orders;

    if (selectedStatus !== "All") {
      result = result.filter((o) => o.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          (o.address.firstName + " " + o.address.lastName)
            .toLowerCase()
            .includes(q) ||
          o.address.phone?.includes(q) ||
          o.address.email?.toLowerCase().includes(q) ||
          o.items.some((item) => item.name.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [orders, selectedStatus, searchQuery]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h3 className="text-lg font-semibold text-gray-700">Orders</h3>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, phone or product..."
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full sm:w-72 outline-none focus:border-gray-500"
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              selectedStatus === status
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
            }`}
          >
            {status}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                selectedStatus === status
                  ? "bg-white text-black"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {statusCounts[status] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-3">
        Showing {filteredOrders.length} of {orders.length} orders
        {selectedStatus !== "All" && ` · Filtered by "${selectedStatus}"`}
        {searchQuery && ` · Search: "${searchQuery}"`}
      </p>

      {/* Orders List */}
      <div className="flex flex-col gap-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-sm">No orders found for this filter.</p>
            {selectedStatus !== "All" && (
              <button
                onClick={() => setSelectedStatus("All")}
                className="mt-3 text-xs text-blue-500 hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          filteredOrders.map((order, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border border-gray-200 rounded-lg p-5 bg-white shadow-sm text-xs sm:text-sm text-gray-700"
            >
              {/* Icon */}
              <img
                className="w-12"
                src={assets.parcel_icon}
                alt="Parcel Icon"
              />

              {/* Order Items + Address */}
              <div>
                <div className="mb-2">
                  {order.items.map((item, idx) => (
                    <p className="py-0.5 text-gray-800" key={idx}>
                      <span className="font-medium">{item.name}</span>
                      {" × "}
                      {item.quantity}
                      {item.size ? (
                        <span className="text-gray-500"> ({item.size})</span>
                      ) : null}
                      {idx < order.items.length - 1 && ","}
                    </p>
                  ))}
                </div>

                <p className="mt-2 mb-1 font-semibold text-gray-800">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <p className="text-gray-500">{order.address.street + ","}</p>
                <p className="text-gray-500">
                  {[
                    order.address.city,
                    order.address.state,
                    order.address.country,
                    order.address.zipcode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="text-gray-500 mt-1">{order.address.phone}</p>
              </div>

              {/* Order Meta */}
              <div className="flex flex-col gap-1 text-xs sm:text-sm">
                <p>
                  <span className="text-gray-400">Items:</span>{" "}
                  {order.items.length}
                </p>
                <p>
                  <span className="text-gray-400">Method:</span>{" "}
                  {order.paymentMethod}
                </p>
                <p>
                  <span className="text-gray-400">Payment:</span>{" "}
                  <span
                    className={
                      order.payment ? "text-green-600" : "text-red-500"
                    }
                  >
                    {order.payment ? "Paid" : "Pending"}
                  </span>
                </p>
                <p>
                  <span className="text-gray-400">Date:</span>{" "}
                  {new Date(order.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Amount */}
              <p className="text-sm sm:text-base font-semibold text-gray-800">
                {currency}
                {order.amount}
              </p>

              {/* Status Dropdown + Badge */}
              <div className="flex flex-col gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full border font-semibold w-fit ${
                    STATUS_STYLES[order.status] ||
                    "bg-gray-100 text-gray-600 border-gray-300"
                  }`}
                >
                  {order.status}
                </span>
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                  className="p-1.5 text-xs border border-gray-300 rounded outline-none cursor-pointer"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
