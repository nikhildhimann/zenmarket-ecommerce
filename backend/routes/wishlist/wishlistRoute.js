import express from "express";
import { getWishlist, toggleWishlistItem } from "../../controllers/wishlist/wishlistController.js";
import protect from "../../middlewares/authMiddleware.js";

const router = express.Router();

// All wishlist routes are protected
router.use(protect);

router.route('/')
    .get(getWishlist)
    .post(toggleWishlistItem);

export default router;