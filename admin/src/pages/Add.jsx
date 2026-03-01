import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const categoryConfig = {
  "Food Products": {
    subCategories: [
      "Instant pickles",
      "Vegetarian pickles",
      "Non-vegetarian pickles",
      "Traditional powders",
      "Sweets",
      "Hots",
    ],
    sizes: ["100g", "250g", "500g", "1kg", "2kg", "5kg"],
    sizeLabel: "Available Weights & Prices",
  },
  "Natural Products": {
    subCategories: [
      "Soaps & Cleansers",
      "Hair Care",
      "Skin Care",
      "Essential Oils",
    ],
    sizes: ["1 pc", "2 pcs", "3 pcs", "5 pcs", "10 pcs"],
    sizeLabel: "Available Quantities & Prices",
  },
  Beverages: {
    subCategories: [
      "Herbal Teas",
      "Health Drinks",
      "Fresh Juices",
      "Smoothie Mixes",
    ],
    sizes: ["100ml", "250ml", "500ml", "1L", "2L"],
    sizeLabel: "Available Volumes & Prices",
  },
};

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food Products");
  const [subCategory, setSubCategory] = useState("Instant pickles");
  const [bestseller, setBestseller] = useState(false);
  // sizes: [{size: "250g", price: 100}, ...]
  const [sizes, setSizes] = useState([]);

  const currentConfig = categoryConfig[category];

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    setSubCategory(categoryConfig[newCategory].subCategories[0]);
    setSizes([]);
  };

  const toggleSize = (sizeName) => {
    setSizes((prev) => {
      const exists = prev.find((s) => s.size === sizeName);
      if (exists) return prev.filter((s) => s.size !== sizeName);
      return [...prev, { size: sizeName, price: "" }];
    });
  };

  const updateSizePrice = (sizeName, price) => {
    setSizes((prev) =>
      prev.map((s) =>
        s.size === sizeName ? { ...s, price: Number(price) } : s,
      ),
    );
  };

  const isSizeSelected = (sizeName) => sizes.some((s) => s.size === sizeName);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (sizes.length === 0) {
      toast.error("Please select at least one size/quantity option.");
      return;
    }

    const invalidSizes = sizes.filter((s) => !s.price || s.price <= 0);
    if (invalidSizes.length > 0) {
      toast.error(
        `Please enter a valid price for: ${invalidSizes.map((s) => s.size).join(", ")}`,
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setSizes([]);
        setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-5"
    >
      {/* Image Upload */}
      <div>
        <p className="mb-2 font-medium">Product Images</p>
        <div className="flex gap-3">
          {[
            { id: "image1", state: image1, setter: setImage1 },
            { id: "image2", state: image2, setter: setImage2 },
            { id: "image3", state: image3, setter: setImage3 },
            { id: "image4", state: image4, setter: setImage4 },
          ].map(({ id, state, setter }) => (
            <label key={id} htmlFor={id} className="cursor-pointer">
              <img
                className="w-20 h-20 object-cover border border-dashed border-gray-300"
                src={!state ? assets.upload_area : URL.createObjectURL(state)}
                alt="Upload"
              />
              <input
                onChange={(e) => setter(e.target.files[0])}
                type="file"
                id={id}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 border border-gray-300"
          type="text"
          placeholder="e.g. Organic Cold-Pressed Coconut Oil"
          required
        />
      </div>

      {/* Description */}
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2 border border-gray-300"
          rows={4}
          placeholder="Describe ingredients, sourcing, benefits, usage..."
          required
        />
      </div>

      {/* Category & SubCategory */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:gap-8">
        <div>
          <p className="mb-2">Category</p>
          <select
            onChange={handleCategoryChange}
            value={category}
            className="w-full px-3 py-2 border border-gray-300"
          >
            <option value="Food Products">Food Products</option>
            <option value="Natural Products">Natural Products</option>
            <option value="Beverages">Beverages</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full px-3 py-2 border border-gray-300"
          >
            {currentConfig.subCategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sizes with per-size Price */}
      <div className="w-full">
        <p className="mb-3 font-medium">{currentConfig.sizeLabel}</p>
        <div className="flex flex-wrap gap-3">
          {currentConfig.sizes.map((sizeName) => {
            const selected = isSizeSelected(sizeName);
            const sizeObj = sizes.find((s) => s.size === sizeName);
            return (
              <div key={sizeName} className="flex flex-col items-center gap-1">
                {/* Size toggle button */}
                <div
                  onClick={() => toggleSize(sizeName)}
                  className={`px-4 py-2 rounded cursor-pointer border text-sm font-medium transition-colors ${
                    selected
                      ? "bg-green-100 border-green-500 text-green-700"
                      : "bg-slate-100 border-gray-300 text-gray-600"
                  }`}
                >
                  {sizeName}
                </div>
                {/* Price input - only shown when size is selected */}
                {selected && (
                  <input
                    type="number"
                    min="1"
                    placeholder="₹ Price"
                    value={sizeObj?.price || ""}
                    onChange={(e) => updateSizePrice(sizeName, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-20 px-2 py-1 text-xs border border-gray-300 rounded text-center"
                  />
                )}
              </div>
            );
          })}
        </div>
        {sizes.length === 0 && (
          <p className="text-xs text-red-400 mt-2">
            Select at least one option and set its price.
          </p>
        )}
        {/* Summary of selected sizes */}
        {sizes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <span
                key={s.size}
                className="text-xs bg-gray-100 border border-gray-300 px-2 py-1 rounded"
              >
                {s.size} — ₹{s.price || "?"}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bestseller */}
      <div className="flex gap-2 items-center">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer text-sm" htmlFor="bestseller">
          Mark as Bestseller
        </label>
      </div>

      <button className="w-36 py-3 bg-black text-white text-sm rounded">
        ADD PRODUCT
      </button>
    </form>
  );
};

export default Add;
