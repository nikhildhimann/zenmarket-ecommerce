import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
    },
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
    },
    state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
    },
    postalCode: {
        type: String,
        required: [true, "Postal code is required"],
        trim: true,
    },
    country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
    },
    phoneNo: {
        type: String,
        required: [true, "Phone number is required"],
    },
}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema);

export default Address; 