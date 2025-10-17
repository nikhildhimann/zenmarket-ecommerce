import mongoose from "mongoose";

// ✨ FIX: Import the Tag model to ensure it's registered with Mongoose
import "./tagModel.js"; 

// 1. Define the schema for a single review FIRST
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// 2. Now define the product schema, which uses the reviewSchema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please enter a product name"], trim: true, maxLength: [100, "Product name cannot exceed 100 characters"] },
    description: { type: String, required: [true, "Please enter a product description"] },
    price: { type: Number, required: [true, "Please enter a product price"], min: [0, "Price cannot be negative"] },
    images: [{ public_id: { type: String, required: true }, url: { type: String, required: true } }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: [true, "Please select a category"] },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: [true, "Please select a brand"] },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }], // This line requires the "Tag" model
    stock: { type: Number, required: [true, "Please enter product stock"], min: [0, "Stock cannot be negative"], default: 1 },
    ratings: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;