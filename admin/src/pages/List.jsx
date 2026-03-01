import axios from "axios";
import React from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const List = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const removeProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const toggleStock = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }
      const response = await axios.post(
        backendUrl + "/api/product/togglestock",
        { id },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        // Update locally without full refetch for better UX
        setList((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, inStock: !currentStatus } : item,
          ),
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <p className="mb-2 font-semibold text-gray-700">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center py-2 px-3 border bg-gray-100 text-sm font-semibold text-gray-600">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>From Price</span>
          <span className="text-center">Stock</span>
          <span className="text-center">Edit</span>
          <span className="text-center">Delete</span>
        </div>

        {/* Product Rows */}
        {list.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-2 px-3 border text-sm ${
              !item.inStock ? "bg-red-50 border-red-200" : "bg-white"
            }`}
          >
            {/* Image */}
            <div className="relative">
              <img
                className={`w-12 h-12 object-cover rounded ${
                  !item.inStock ? "opacity-50 grayscale" : ""
                }`}
                src={item.images?.[0] || "/placeholder.png"}
                alt={item.name}
              />
              {!item.inStock && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1 py-0.5 rounded font-bold">
                  OUT
                </span>
              )}
            </div>

            {/* Name */}
            <div>
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-400">{item.subCategory}</p>
            </div>

            {/* Category */}
            <p className="text-gray-600">{item.category}</p>

            {/* Price */}
            <p className="text-gray-700">
              From {currency}
              {item.price}
            </p>

            {/* Stock Toggle */}
            <div className="flex justify-center">
              <button
                onClick={() => toggleStock(item._id, item.inStock)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  item.inStock
                    ? "bg-green-100 text-green-700 border-green-400 hover:bg-red-100 hover:text-red-600 hover:border-red-400"
                    : "bg-red-100 text-red-600 border-red-400 hover:bg-green-100 hover:text-green-700 hover:border-green-400"
                }`}
                title={
                  item.inStock
                    ? "Click to mark Out of Stock"
                    : "Click to mark In Stock"
                }
              >
                {item.inStock ? "In Stock" : "Out of Stock"}
              </button>
            </div>

            {/* Edit */}
            <p
              onClick={() => navigate(`/edit/${item._id}`)}
              className="text-center cursor-pointer text-blue-500 hover:text-blue-700 font-medium"
            >
              Edit
            </p>

            {/* Delete */}
            <p
              onClick={() => removeProduct(item._id)}
              className="text-center cursor-pointer text-red-500 hover:text-red-700 text-lg font-bold"
            >
              ✕
            </p>
          </div>
        ))}

        {list.length === 0 && (
          <p className="text-center text-gray-400 py-10">No products found.</p>
        )}
      </div>
    </>
  );
};

export default List;
