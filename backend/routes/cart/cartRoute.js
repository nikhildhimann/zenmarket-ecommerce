import express from "express";
import {
    getCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart
} from "../../controllers/cart/cartController.js";
import protect from "../../middlewares/authMiddleware.js";

const router = express.Router();

// All cart routes are protected and require a user to be logged in
router.use(protect);

router.route('/')
    .get(getCart)
    .post(addItemToCart);

router.route('/:itemId')
    .put(updateCartItemQuantity)
    .delete(removeItemFromCart);

export default router;