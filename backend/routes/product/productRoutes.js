import express from "express";
import { getAllProducts, getProductDetails, createProduct, updateProduct, deleteProduct } from "../../controllers/Product/productController.js";
import { upload } from "../../middlewares/multer.js";
import protect from "../../middlewares/authMiddleware.js";
import authorizeRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductDetails);

// Admin Only
router.post("/new", protect, authorizeRoles('admin'), upload.array("images", 5), createProduct);
router.route("/:id")
    .put(protect, authorizeRoles('admin'), upload.array("images", 5), updateProduct)
    .delete(protect, authorizeRoles('admin'), deleteProduct);

export default router;