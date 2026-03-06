import { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import LoadingSpinner from "../components/LoadingSpinner";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [cartLoading, setCartLoading] = useState(false);

  // Get price for the currently selected size, or show min price
  const getDisplayPrice = () => {
    if (!productData) return 0;
    if (size) {
      const sizeObj = productData.sizes.find((s) => s.size === size);
      return sizeObj ? sizeObj.price : productData.price;
    }
    return productData.price; // min price (set by backend)
  };

  const fetchProductData = useCallback(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.images[0]);
    }
  }, [productId, products]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Section */}
      <div className="flex flex-col sm:flex-row gap-12">
        {/* Left Section: Images */}
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Thumbnails */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto sm:w-[20%] w-full gap-2">
            {productData.images.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className={`w-24 h-24 object-cover cursor-pointer border ${
                  image === item ? "border-orange-500" : "border-gray-200"
                }`}
                alt={`Thumbnail ${index + 1}`}
              />
            ))}
          </div>
          {/* Main Image */}
          <div className="w-full sm:w-[80%]">
            <img
              src={image}
              className="w-full h-auto border border-gray-200"
              alt="Main Product"
            />
          </div>
        </div>

        {/* Right Section: Product Details */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} className="w-3.5" alt="Star" />
            <img src={assets.star_icon} className="w-3.5" alt="Star" />
            <img src={assets.star_icon} className="w-3.5" alt="Star" />
            <img src={assets.star_icon} className="w-3.5" alt="Star" />
            <img
              src={assets.star_dull_icon}
              className="w-3.5"
              alt="Dull Star"
            />
            <p className="pl-2">122</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {!size && <span className="text-lg text-gray-400 mr-1">From</span>}
            {currency}
            {getDisplayPrice()}
          </p>
          <p className="mt-5 text-gray-500">{productData.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>
              Select Pack Size{" "}
              {size && (
                <span className="text-sm text-green-600 font-normal">
                  — {currency}
                  {getDisplayPrice()}
                </span>
              )}
            </p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item.size)}
                  key={index}
                  className={`bg-gray-100 py-2 px-4 border flex flex-col items-center gap-0.5 ${
                    item.size === size ? "border-orange-500" : ""
                  }`}
                >
                  <span>{item.size}</span>
                  <span className="text-xs text-gray-500">
                    {currency}
                    {item.price}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={async () => {
              if (!size || cartLoading) return;
              setCartLoading(true);
              await addToCart(productData._id, size);
              setCartLoading(false);
            }}
            disabled={!size || cartLoading}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 disabled:opacity-60 flex items-center gap-2"
          >
            {cartLoading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                Adding...
              </>
            ) : (
              "ADD TO CART"
            )}
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>
              100% Natural & Organic — no artificial additives or preservatives.
            </p>
            {/* <p>Cash on delivery available on this product.</p>
            <p>Freshness guaranteed or easy return within 7 days.</p> */}
          </div>
        </div>
      </div>

      {/* Description and Reviews */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence. E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility, and the global reach they offer.
          </p>
          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
