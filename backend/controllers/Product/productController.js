import mongoose from 'mongoose';
import { v2 as cloudinary } from "cloudinary";
import Product from "../../models/product/productModel.js";
import { uploadOnCloudinary } from "../../config/cloudinary.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

// ✨ FIX: Removed the incorrect 'import sendEmail from ...' which was causing the server to crash.
// This controller's responsibility is to manage products, not send emails.

export const getAllProducts = asyncHandler(async (req, res) => {
    const { category, brand, sort, keyword, page = 1, limit = 10 } = req.query;
    let query = {};
    if (keyword) query.name = { $regex: keyword, $options: 'i' };
    if (category && mongoose.Types.ObjectId.isValid(category)) query.category = category;
    if (brand && mongoose.Types.ObjectId.isValid(brand)) query.brand = brand;
    const sortOption = {};
    if (sort === 'price-asc') sortOption.price = 1;
    else if (sort === 'price-desc') sortOption.price = -1;
    else if (sort === 'name-asc') sortOption.name = 1;
    else if (sort === 'name-desc') sortOption.name = -1;
    else sortOption.createdAt = -1;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limitNum);
    const products = await Product.find(query).sort(sortOption).skip(skip).limit(limitNum).populate('category', 'name').populate('brand', 'name');
    res.status(200).json({ success: true, products, pagination: { totalProducts, totalPages, currentPage: pageNum } });
});

export const getProductDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid product ID format.");
    }
    const product = await Product.findById(id).populate('category', 'name').populate('brand', 'name').populate('tags', 'name');
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    res.status(200).json({ success: true, product });
});

export const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, brand, stock, tags } = req.body;
    if ([name, description, price, category, brand, stock].some((field) => !field || String(field).trim() === "")) throw new ApiError(400, "Please fill all required fields");
    if (!req.files || req.files.length === 0) throw new ApiError(400, "Please upload at least one image");
    const images = [];
    for (const file of req.files) {
        const result = await uploadOnCloudinary(file.path);
        if (result) images.push({ public_id: result.public_id, url: result.secure_url });
    }
    if (images.length === 0) throw new ApiError(500, "Image upload failed.");
    const product = await Product.create({ name, description, price, images, category, brand, stock, tags: tags ? tags.split(',') : [], user: req.user._id });
    if (!product) throw new ApiError(500, "Failed to create product.");
    res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, "Product not found");
    const { imagesToDelete } = req.body;
    if (imagesToDelete) {
        const publicIds = Array.isArray(imagesToDelete) ? imagesToDelete : [imagesToDelete];
        if (publicIds.length > 0) {
            await cloudinary.api.delete_resources(publicIds);
            product.images = product.images.filter(img => !publicIds.includes(img.public_id));
        }
    }
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const result = await uploadOnCloudinary(file.path);
            if (result) product.images.push({ public_id: result.public_id, url: result.secure_url });
        }
    }
    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.status(200).json({ success: true, product: updatedProduct });
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, "Product not found");
    const publicIds = product.images.map(img => img.public_id);
    if (publicIds.length > 0) {
        await cloudinary.api.delete_resources(publicIds);
    }
    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product deleted successfully" });
});
