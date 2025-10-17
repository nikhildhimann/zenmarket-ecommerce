import express from "express";
import Category from "../../models/product/categoryModel.js";

const router = express.Router();

// @desc    Fetch all categories
// @route   GET /api/v1/categories
// @access  Public
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;