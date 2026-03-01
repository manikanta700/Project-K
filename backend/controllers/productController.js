import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req, res) => {
  try {
    const { name, description, category, subCategory, sizes, bestseller } =
      req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No images uploaded" });
    }

    const image1 = req.files.image1?.[0];
    const image2 = req.files.image2?.[0];
    const image3 = req.files.image3?.[0];
    const image4 = req.files.image4?.[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );

    // Parse sizes - expected as [{size: "250g", price: 100}, ...]
    const parsedSizes = JSON.parse(sizes);

    // Auto-compute min price from sizes for product listing display
    const price = Math.min(...parsedSizes.map((s) => s.price));

    const productData = {
      name,
      description,
      price,
      category,
      subCategory,
      sizes: parsedSizes,
      bestseller: bestseller === "true" ? true : false,
      images: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();
    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for update product
const updateProduct = async (req, res) => {
  try {
    const { id, name, description, category, subCategory, sizes, bestseller } =
      req.body;

    const parsedSizes = JSON.parse(sizes);
    const price = Math.min(...parsedSizes.map((s) => s.price));

    // Get existing product to preserve images
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.json({ success: false, message: "Product not found" });
    }

    let images = [...existingProduct.images];

    // Upload new images if provided, otherwise keep existing
    const slots = ["image1", "image2", "image3", "image4"];
    for (let i = 0; i < slots.length; i++) {
      const file = req.files?.[slots[i]]?.[0];
      if (file) {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        images[i] = result.secure_url;
      }
    }

    await productModel.findByIdAndUpdate(id, {
      name,
      description,
      price,
      category,
      subCategory,
      sizes: parsedSizes,
      bestseller: bestseller === "true" ? true : false,
      images,
    });

    res.json({ success: true, message: "Product Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for remove product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function to toggle in stock / out of stock
const toggleStock = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await productModel.findById(id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    await productModel.findByIdAndUpdate(id, { inStock: !product.inStock });
    res.json({
      success: true,
      message: `Product marked as ${!product.inStock ? "In Stock" : "Out of Stock"}`,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  listProducts,
  addProduct,
  updateProduct,
  removeProduct,
  singleProduct,
  toggleStock,
};
