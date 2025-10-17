import express from "express";
import { applyCouponToCart, createCoupon, deleteCoupon, getAllCoupons, removeCouponFromCart } from "../../controllers/coupon/couponController.js";
import protect from "../../middlewares/authMiddleware.js";
import authorizeRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

// Admin-only routes for managing coupons
router.route('/')
    .get(protect, authorizeRoles('admin'), getAllCoupons)
    .post(protect, authorizeRoles('admin'), createCoupon);

router.route('/:id')
    .delete(protect, authorizeRoles('admin'), deleteCoupon);

// User-facing routes
router.post('/apply', protect, applyCouponToCart);

// ✨ FIX: This route correctly defines that removing a coupon requires a POST request.
router.post('/remove', protect, removeCouponFromCart);

export default router;

