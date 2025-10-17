import express from "express";
import { processPayuPayment, payuSuccess, payuFailure } from "../../controllers/payment/paymentController.js";
import protect from "../../middlewares/authMiddleware.js";

const router = express.Router();

// This route is called by your frontend to start the payment
router.post('/payu', protect, processPayuPayment);

// These routes are called by PayU's servers after the transaction
router.post('/payu/success', payuSuccess);
router.post('/payu/failure', payuFailure);

export default router;