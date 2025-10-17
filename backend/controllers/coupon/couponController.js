import Coupon from "../../models/coupon/couponModel.js";
import Cart from "../../models/cart/cartModel.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

// @desc    Create a new coupon
// @route   POST /api/v1/coupon
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
    const { code, discountType, discountAmount, expiryDate, minPurchase } = req.body;
    if (!code || !discountType || !discountAmount || !expiryDate) {
        throw new ApiError(400, "Please provide all required coupon details.");
    }
    // Ensure coupon code is uppercase for consistency
    const coupon = await Coupon.create({ code: code.toUpperCase(), discountType, discountAmount, expiryDate, minPurchase });
    res.status(201).json({ success: true, coupon });
});

// @desc    Get all coupons
// @route   GET /api/v1/coupon
// @access  Private/Admin
export const getAllCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({});
    res.status(200).json({ success: true, coupons });
});

// @desc    Delete a coupon
// @route   DELETE /api/v1/coupon/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
        throw new ApiError(404, "Coupon not found.");
    }
    await coupon.deleteOne();
    res.status(200).json({ success: true, message: "Coupon deleted." });
});

// @desc    Apply a coupon to the user's cart
// @route   POST /api/v1/coupon/apply
// @access  Private
export const applyCouponToCart = asyncHandler(async (req, res) => {
    const { couponCode } = req.body;
    const userId = req.user._id;

    if (!couponCode) {
        throw new ApiError(400, "Coupon code is required.");
    }

    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), expiryDate: { $gt: Date.now() } });
    if (!coupon) {
        throw new ApiError(404, "Invalid or expired coupon code.");
    }

    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Your cart is empty.");
    }

    const subtotal = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    if (subtotal < coupon.minPurchase) {
        throw new ApiError(400, `You must spend at least ₹${coupon.minPurchase} to use this coupon.`);
    }

    cart.coupon = coupon._id;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product').populate('coupon');
    res.status(200).json({ success: true, cart: populatedCart });
});

// @desc    Remove an applied coupon from the cart
// @route   POST /api/v1/coupon/remove
// @access  Private
export const removeCouponFromCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    // Use $unset to completely remove the coupon field from the document
    const cart = await Cart.findOneAndUpdate({ user: userId }, { $unset: { coupon: "" } }, { new: true }).populate('items.product');
    if (!cart) {
        throw new ApiError(404, "Cart not found.");
    }
    res.status(200).json({ success: true, cart });
});

