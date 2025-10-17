import express from "express";
import { createOrder, getMyOrders, getOrderDetails,getAllOrders, updateOrderStatus    } from "../../controllers/order/orderController.js";
import protect from "../../middlewares/authMiddleware.js";
import authorizeRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();


// User routes
router.route('/').post(protect, createOrder);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderDetails);

// Admin routes
router.route('/admin/all').get(protect, authorizeRoles('admin'), getAllOrders);
router.route('/admin/:id').put(protect, authorizeRoles('admin'), updateOrderStatus);

export default router;