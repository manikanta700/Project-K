import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subcategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category),
      );
    }
    if (subcategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subcategory.includes(item.subCategory),
      );
    }
    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subcategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  const categories = ["Food Products", "Natural Products", "Beverages"];
  const subcategories = [
    "Instant pickles", "Dry Fruits & Nuts", "Spices & Herbs",
    "Oils & Ghee", "Soaps & Cleansers", "Hair Care",
    "Herbal Teas", "Health Drinks",
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-6 pt-8 pb-16">
      {/* Filter Sidebar */}
      <div className="sm:min-w-56 sm:max-w-56">
        {/* Filter toggle header (mobile) */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center justify-between w-full sm:w-auto sm:cursor-default mb-3"
        >
          <p className="font-bold text-gray-800 text-base tracking-wide uppercase">
            Filters
          </p>
          <img
            className={`h-3 sm:hidden transition-transform duration-200 ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </button>

        {/* Filter panels */}
        <div className={`flex flex-col gap-4 ${showFilter ? "block" : "hidden"} sm:block`}>
          {/* Category */}
          <div className="card p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Categories</p>
            <div className="flex flex-col gap-2.5">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    onChange={toggleCategory}
                    value={cat}
                    className="w-4 h-4 accent-[#2d7a4f] rounded"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-[#2d7a4f] transition-colors">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Subcategory */}
          <div className="card p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Type</p>
            <div className="flex flex-col gap-2.5">
              {subcategories.map((sub) => (
                <label key={sub} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    onChange={toggleSubCategory}
                    value={sub}
                    className="w-4 h-4 accent-[#2d7a4f] rounded"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-[#2d7a4f] transition-colors">
                    {sub}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products area */}
      <div className="flex-1">
        {/* Header + sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="text-xl sm:text-2xl">
            <Title text1={"ALL"} text2={"PRODUCTS"} />
          </div>
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border border-gray-200 rounded-xl text-sm px-3 py-2 outline-none focus:border-[#2d7a4f] bg-white text-gray-600 transition-colors"
          >
            <option value="relevant">Sort: Relevant</option>
            <option value="low-high">Price: Low → High</option>
            <option value="high-low">Price: High → Low</option>
          </select>
        </div>

        {/* Product grid */}
        {filterProducts.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-20 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold text-gray-700">No products found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.images}
                inStock={item.inStock}
                sizes={item.sizes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
