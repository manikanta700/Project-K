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

// Statuses that MUST have a tracking ID
const NEEDS_TRACKING = ["Shipped", "Out for delivery"];

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // pendingStatusChange: { [orderId]: { newStatus, trackingId, courier } }
  // When admin picks a tracking-required status, we hold it here until they fill the form and confirm.
  const [pendingChanges, setPendingChanges] = useState({});
  const [saving, setSaving] = useState(null);

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Called when dropdown value changes
  const onStatusDropdownChange = (event, order) => {
    const newStatus = event.target.value;

    if (NEEDS_TRACKING.includes(newStatus)) {
      // Don't save yet — open the inline tracking form
      setPendingChanges((prev) => ({
        ...prev,
        [order._id]: {
          newStatus,
          trackingId: order.trackingId || "",
          courier: order.courier || "DTDC",
        },
      }));
    } else {
      // No tracking needed — save immediately
      saveStatusOnly(order._id, newStatus);
    }
  };

  // Save status without tracking (for non-shipping statuses)
  const saveStatusOnly = async (orderId, newStatus) => {
    setSaving(orderId);
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success("Order status updated");
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)),
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(null);
    }
  };

  // Save status + tracking together (for Shipped / Out for delivery)
  const confirmStatusWithTracking = async (orderId) => {
    const pending = pendingChanges[orderId];
    if (!pending) return;

    if (!pending.trackingId.trim()) {
      toast.error("Tracking ID is required for this status");
      return;
    }

    setSaving(orderId);
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        {
          orderId,
          status: pending.newStatus,
          trackingId: pending.trackingId.trim(),
          courier: pending.courier,
        },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success("Order status & tracking saved!");
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? {
                ...o,
                status: pending.newStatus,
                trackingId: pending.trackingId.trim(),
                courier: pending.courier,
              }
              : o,
          ),
        );
        // Clear the pending change
        setPendingChanges((prev) => {
          const updated = { ...prev };
          delete updated[orderId];
          return updated;
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save");
    } finally {
      setSaving(null);
    }
  };

  const cancelPending = (orderId) => {
    setPendingChanges((prev) => {
      const updated = { ...prev };
      delete updated[orderId];
      return updated;
    });
  };

  // Edit existing tracking on a shipped order
  const editTracking = (order) => {
    setPendingChanges((prev) => ({
      ...prev,
      [order._id]: {
        newStatus: order.status,
        trackingId: order.trackingId || "",
        courier: order.courier || "DTDC",
      },
    }));
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const statusCounts = useMemo(() => {
    const counts = { All: orders.length };
    STATUS_OPTIONS.slice(1).forEach((s) => {
      counts[s] = orders.filter((o) => o.status === s).length;
    });
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (selectedStatus !== "All") {
      result = result.filter((o) => o.status === selectedStatus);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          (o.address.firstName + " " + o.address.lastName).toLowerCase().includes(q) ||
          o.address.phone?.includes(q) ||
          o.address.email?.toLowerCase().includes(q) ||
          o.items.some((item) => item.name.toLowerCase().includes(q)) ||
          (o.orderId && o.orderId.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [orders, selectedStatus, searchQuery]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h3 className="text-lg font-semibold text-gray-700">Orders</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, phone, order ID..."
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full sm:w-72 outline-none focus:border-gray-500"
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${selectedStatus === status
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
              }`}
          >
            {status}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${selectedStatus === status ? "bg-white text-black" : "bg-gray-100 text-gray-600"
                }`}
            >
              {statusCounts[status] || 0}
            </span>
          </button>
        ))}
      </div>

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
          filteredOrders.map((order, index) => {
            const pending = pendingChanges[order._id];
            const isSaving = saving === order._id;
            const hasTracking = order.trackingId && order.courier;
            // The status to show in the dropdown (pending new status or the real saved one)
            const displayStatus = pending ? pending.newStatus : order.status;

            return (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border border-gray-200 rounded-lg p-5 bg-white shadow-sm text-xs sm:text-sm text-gray-700"
              >
                {/* Icon */}
                <img className="w-12" src={assets.parcel_icon} alt="Parcel Icon" />

                {/* Order Items + Address */}
                <div>
                  {order.orderId && (
                    <span className="inline-block mb-2 font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                      #{order.orderId}
                    </span>
                  )}
                  <div className="mb-2">
                    {order.items.map((item, idx) => (
                      <p className="py-0.5 text-gray-800" key={idx}>
                        <span className="font-medium">{item.name}</span>
                        {" × "}
                        {item.quantity}
                        {item.size ? <span className="text-gray-500"> ({item.size})</span> : null}
                        {idx < order.items.length - 1 && ","}
                      </p>
                    ))}
                  </div>
                  <p className="mt-2 mb-1 font-semibold text-gray-800">
                    {order.address.firstName + " " + order.address.lastName}
                  </p>
                  <p className="text-gray-500">{order.address.street + ","}</p>
                  <p className="text-gray-500">
                    {[order.address.city, order.address.state, order.address.country, order.address.zipcode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="text-gray-500 mt-1">{order.address.phone}</p>
                </div>

                {/* Order Meta */}
                <div className="flex flex-col gap-1 text-xs sm:text-sm">
                  <p><span className="text-gray-400">Items:</span> {order.items.length}</p>
                  <p><span className="text-gray-400">Method:</span> {order.paymentMethod}</p>
                  <p>
                    <span className="text-gray-400">Payment:</span>{" "}
                    <span className={order.payment ? "text-green-600" : "text-red-500"}>
                      {order.payment ? "Paid" : "Pending"}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">Date:</span>{" "}
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>

                {/* Amount */}
                <p className="text-sm sm:text-base font-semibold text-gray-800">
                  {currency}{order.amount}
                </p>

                {/* Status + Tracking section */}
                <div className="flex flex-col gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border font-semibold w-fit ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600 border-gray-300"
                      }`}
                  >
                    {order.status}
                  </span>

                  {/* Status dropdown */}
                  <select
                    onChange={(e) => onStatusDropdownChange(e, order)}
                    value={displayStatus}
                    disabled={isSaving}
                    className="p-1.5 text-xs border border-gray-300 rounded outline-none cursor-pointer disabled:opacity-60"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>

                  {/* ── TRACKING FORM (shown when pending or editing) ── */}
                  {pending ? (
                    <div className="mt-1 p-3 bg-purple-50 border-2 border-purple-300 rounded-lg flex flex-col gap-2">
                      <p className="text-xs font-bold text-purple-700 flex items-center gap-1">
                        🚚 Tracking Info Required
                      </p>
                      <p className="text-xs text-purple-500">
                        Required for "{pending.newStatus}" status
                      </p>

                      {/* Courier */}
                      <div>
                        <label className="text-xs text-gray-500 mb-0.5 block">Courier *</label>
                        <select
                          value={pending.courier}
                          onChange={(e) =>
                            setPendingChanges((prev) => ({
                              ...prev,
                              [order._id]: { ...prev[order._id], courier: e.target.value },
                            }))
                          }
                          className="w-full p-1.5 text-xs border border-gray-300 rounded outline-none focus:border-purple-400"
                        >
                          <option value="DTDC">DTDC</option>
                          <option value="India Post">India Post</option>
                        </select>
                      </div>

                      {/* Tracking ID */}
                      <div>
                        <label className="text-xs text-gray-500 mb-0.5 block">
                          Tracking ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter tracking number"
                          value={pending.trackingId}
                          onChange={(e) =>
                            setPendingChanges((prev) => ({
                              ...prev,
                              [order._id]: { ...prev[order._id], trackingId: e.target.value },
                            }))
                          }
                          className="w-full p-1.5 text-xs border border-gray-300 rounded outline-none focus:border-purple-400 font-mono"
                          autoFocus
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-1.5 mt-1">
                        <button
                          disabled={isSaving}
                          onClick={() => confirmStatusWithTracking(order._id)}
                          className="flex-1 bg-purple-600 text-white text-xs py-1.5 rounded font-semibold hover:bg-purple-700 transition-colors disabled:opacity-60"
                        >
                          {isSaving ? "Saving…" : "✓ Confirm & Save"}
                        </button>
                        <button
                          disabled={isSaving}
                          onClick={() => cancelPending(order._id)}
                          className="flex-1 border border-gray-300 text-gray-600 text-xs py-1.5 rounded hover:bg-gray-100 transition-colors disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── EXISTING TRACKING BADGE (read-only) ── */
                    hasTracking && NEEDS_TRACKING.includes(order.status) && (
                      <div className="mt-1 p-2 bg-green-50 border border-green-200 rounded text-xs">
                        <p className="text-green-700 font-semibold mb-0.5">✓ Tracking Set</p>
                        <p className="text-gray-600">📦 {order.courier}</p>
                        <p className="font-mono text-gray-700 break-all">{order.trackingId}</p>
                        <button
                          onClick={() => editTracking(order)}
                          className="mt-1 text-xs text-blue-500 hover:underline"
                        >
                          Edit tracking
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
