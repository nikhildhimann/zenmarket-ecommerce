import express from "express";
// ✨ FIX: Only import the single, correct function
import { getDashboardStats } from "../../controllers/analytics/analyticsController.js";
import protect from "../../middlewares/authMiddleware.js";
import authorizeRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

// All analytics routes are protected for admins
router.use(protect, authorizeRoles('admin'));

// ✨ FIX: Use the single endpoint to get all dashboard data at once
router.route('/stats').get(getDashboardStats);

export default router;

