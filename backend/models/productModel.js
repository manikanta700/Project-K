import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }, // min price across sizes (for listings)
  images: { type: [String], required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: {
    type: [
      {
        size: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    required: true,
  },
  bestseller: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  date: { type: Number, required: true },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
