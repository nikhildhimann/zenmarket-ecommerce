import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Please provide a coupon code"],
        unique: true,
        uppercase: true,
        trim: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: [true, "Please specify the discount type"],
    },
    discountAmount: {
        type: Number,
        required: [true, "Please provide the discount amount"],
    },
    expiryDate: {
        type: Date,
        required: [true, "Please provide an expiry date"],
    },
    minPurchase: {
        type: Number,
        default: 0,
    },
    usageLimit: {
        type: Number,
        default: 1, // Can be used by how many users in total
    },
    timesUsed: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
