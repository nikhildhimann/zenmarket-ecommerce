import Order from "../../models/order/orderModel.js";
import Cart from "../../models/cart/cartModel.js";
import Product from "../../models/product/productModel.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

// @desc    Create a new order
// @route   POST /api/v1/order
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
    const { shippingAddressId } = req.body;
    const userId = req.user._id;

    if (!shippingAddressId) {
        throw new ApiError(400, "Shipping address is required");
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Your cart is empty");
    }

    const orderItems = cart.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        image: item.product.images[0]?.url,
        price: item.product.price,
        product: item.product._id,
    }));

    const totalPrice = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

    const order = await Order.create({
        user: userId,
        shippingAddress: shippingAddressId,
        orderItems,
        totalPrice,
    });

    for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
            $inc: { stock: -item.quantity },
        });
    }

    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order });
});

// @desc    Get logged in user's orders
// @route   GET /api/v1/order/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    if (!orders) {
        throw new ApiError(404, "You have no orders.");
    }
    res.status(200).json({ success: true, orders });
});

// @desc    Get single order by ID
// @route   GET /api/v1/order/:id
// @access  Private
export const getOrderDetails = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'username email')
        .populate('shippingAddress');

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
        throw new ApiError(401, "Not authorized to view this order");
    }

    res.status(200).json({ success: true, order });
});

// @desc    Get all orders (Admin)
// @route   GET /api/v1/order/admin/all
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate('user', 'username email') // This already fetches the username
        .sort({ createdAt: -1 })
        .lean();

    const processedOrders = orders.map(order => {
        if (!order.user) {
            // ✨ FIX: Add a username to the placeholder object
            return {
                ...order,
                user: {
                    username: 'Deleted User', // Provide a clear placeholder username
                    email: 'N/A'
                }
            };
        }
        return order;
    });

    res.status(200).json({ success: true, orders: processedOrders });
});

// @desc    Update order status (Admin)
// @route   PUT /api/v1/order/admin/:id
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new ApiError(404, "Order not found with this ID");
    }

    if (order.orderStatus === "Delivered") {
        throw new ApiError(400, "You have already delivered this order");
    }

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({ success: true });
});
