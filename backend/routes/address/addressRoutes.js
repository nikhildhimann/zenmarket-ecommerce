import express from "express";
import { addAddress, getAddresses,deleteAddress } from "../../controllers/address/addressController.js";
import protect from "../../middlewares/authMiddleware.js";

const router = express.Router();

// All address routes are protected
router.use(protect);

router.route('/')
    .post(addAddress)
    .get(getAddresses);

    router.route('/:id')
    .delete(deleteAddress);

export default router;