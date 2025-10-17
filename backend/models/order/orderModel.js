import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true,
    },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],
    paymentInfo: {
        id: { type: String },
        status: { type: String, default: 'Pending' },
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing',
        // --- THIS IS THE FIX ---
        // Added the new statuses to the list of allowed values
        enum: ['Pending Payment', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Payment Failed'],
    },
    deliveredAt: {
        type: Date,
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;