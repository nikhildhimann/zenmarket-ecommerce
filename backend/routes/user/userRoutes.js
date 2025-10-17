import express from "express";
import { getUserDashboard, updateUserProfile } from "../../controllers/authController.js";
import protect from "../../middlewares/authMiddleware.js";
import authorizeRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

// This is a more organized way to handle multiple request types (GET, PUT) on the same URL.
router.route("/dashboard")
    .get(protect, getUserDashboard)    // Handles GET requests to fetch profile data.
    .put(protect, updateUserProfile);   // Handles PUT requests to update profile data.

// This admin-only route remains unchanged.
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: `Hello Admin ${req.user.username}, this is the admin panel.`,
    user: req.user,
  });
});

export default router;

