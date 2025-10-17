import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/adminAuthController.js";
// You can also import admin-specific password reset controllers here if needed

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

export default router;