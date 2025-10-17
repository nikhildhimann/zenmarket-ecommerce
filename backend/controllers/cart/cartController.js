import Cart from "../../models/cart/cartModel.js";
import Product from "../../models/product/productModel.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

export const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.status(200).json({ success: true, cart });
});

export const addItemToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) throw new ApiError(400, "Product ID and quantity are required");
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    const numQuantity = Number(quantity);
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += numQuantity;
    } else {
        cart.items.push({ product: productId, quantity: numQuantity });
    }
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.status(200).json({ success: true, cart: populatedCart });
});

export const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) throw new ApiError(400, "A valid quantity is required.");
    const cart = await Cart.findOneAndUpdate(
        { "user": req.user._id, "items._id": itemId },
        { "$set": { "items.$.quantity": Number(quantity) } },
        { new: true }
    ).populate('items.product');
    if (!cart) throw new ApiError(404, "Cart or item not found");
    res.status(200).json({ success: true, cart });
});

export const removeItemFromCart = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const updatedCart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { items: { _id: itemId } } },
        { new: true }
    ).populate('items.product');
    if (!updatedCart) throw new ApiError(404, "Cart not found");
    res.status(200).json({ success: true, cart: updatedCart });
});
