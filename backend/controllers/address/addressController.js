import Address from "../../models/address/addressModel.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

// @desc    Add a new shipping address
// @route   POST /api/v1/address
// @access  Private
export const addAddress = asyncHandler(async (req, res) => {
    const { street, city, state, postalCode, country, phoneNo } = req.body;

    const address = await Address.create({
        user: req.user._id,
        street,
        city,
        state,
        postalCode,
        country,
        phoneNo
    });

    res.status(201).json({ success: true, address });
});

// @desc    Get all addresses for a user
// @route   GET /api/v1/address
// @access  Private
export const getAddresses = asyncHandler(async (req, res) => {
    const addresses = await Address.find({ user: req.user._id });
    res.status(200).json({ success: true, addresses });
});


// @desc    Delete a shipping address
// @route   DELETE /api/v1/address/:id
// @access  Private
export const deleteAddress = asyncHandler(async (req, res) => {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (!address) {
        throw new ApiError(404, "Address not found or you're not authorized to delete it.");
    }

    await address.deleteOne();

    res.status(200).json({ success: true, message: "Address deleted successfully" });
});