import Product from "../../models/product/productModel.js";
import Review from "../../models/review/reviewModel.js"; // Import the new model
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

// @desc    Create new review or update the review
// @route   POST /api/v1/review
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment, productId } = req.body;
    const { user } = req;

    if (!rating || !comment || !productId) {
        throw new ApiError(400, "Rating, comment, and productId are required.");
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    // Check if the user has already reviewed this product
    let review = await Review.findOne({ product: productId, user: user._id });

    if (review) {
        // Update existing review
        review.rating = rating;
        review.comment = comment;
        await review.save();
    } else {
        // Create a new review
        review = await Review.create({
            product: productId,
            user: user._id,
            rating,
            comment,
        });
    }

    // --- Update Product's overall rating ---
    const reviews = await Review.find({ product: productId });
    const numOfReviews = reviews.length;
    const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
    const averageRating = numOfReviews > 0 ? totalRating / numOfReviews : 0;

    product.numOfReviews = numOfReviews;
    product.ratings = averageRating;

    // Also update the embedded reviews for quick access on product page
    product.reviews = reviews.map(r => ({
        user: r.user,
        name: user.username, // You might need to populate user to get name, or pass it
        rating: r.rating,
        comment: r.comment,
    }));

    await product.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: "Review submitted successfully." });
});

// @desc    Get all reviews for a single product
// @route   GET /api/v1/review/:productId
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'username');
    
    res.status(200).json({
        success: true,
        reviews,
    });
});
