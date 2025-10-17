import express from "express";
import Brand from "../../models/product/brandModel.js";

const router = express.Router();

// @desc    Fetch all brands
// @route   GET /api/v1/brands
// @access  Public
router.get('/', async (req, res) => {
    try {
        const brands = await Brand.find({});
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;