import express from "express";
import { createProductReview, getProductReviews } from "../../controllers/review/reviewController.js";
import protect from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Route to post a review (requires user to be logged in)
router.route('/').post(protect, createProductReview);

// Route to get all reviews for a specific product (public)
router.route('/:productId').get(getProductReviews);

export default router;
