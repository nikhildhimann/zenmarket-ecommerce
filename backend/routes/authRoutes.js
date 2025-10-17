import express from "express";
import { registerUser, loginUser, resetPassword, requestPasswordReset } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
// Route to request password reset
router.post('/requestPasswordReset', requestPasswordReset);

// Route to reset password
router.put('/resetPassword', resetPassword);

export default router;
