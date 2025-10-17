import Wishlist from "../../models/wishlist/wishlistModel.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

// @desc    Get user's wishlist
// @route   GET /api/v1/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
        path: 'products',
        select: 'name price images stock' // Select specific fields from the product
    });

    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.status(200).json({ success: true, wishlist });
});

// @desc    Add or remove an item from the wishlist
// @route   POST /api/v1/wishlist
// @access  Private
export const toggleWishlistItem = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
        wishlist = new Wishlist({ user: userId, products: [] });
    }

    const productIndex = wishlist.products.indexOf(productId);
    let message = '';

    if (productIndex > -1) {
        // Product exists, so remove it
        wishlist.products.splice(productIndex, 1);
        message = 'Item removed from wishlist';
    } else {
        // Product doesn't exist, so add it
        wishlist.products.push(productId);
        message = 'Item added to wishlist';
    }

    await wishlist.save();
    const populatedWishlist = await wishlist.populate({
        path: 'products',
        select: 'name price images stock'
    });
    
    res.status(200).json({ success: true, message, wishlist: populatedWishlist });
});