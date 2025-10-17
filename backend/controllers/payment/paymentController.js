import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import Cart from "../../models/cart/cartModel.js";
import Order from "../../models/order/orderModel.js";
import crypto from 'crypto';

// @desc    Prepare PayU transaction details
export const processPayuPayment = asyncHandler(async (req, res) => {
    const { email, phone, firstName } = req.user;
    const { shippingAddressId } = req.body;

    if (!shippingAddressId) {
        throw new ApiError(400, "Shipping address is required.");
    }

    // ✨ FIX 1: Populate the 'coupon' field along with the products.
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product').populate('coupon');
    if (!cart || !cart.items || cart.items.length === 0) {
        throw new ApiError(400, "Your cart is empty");
    }

    // ✨ FIX 2: Calculate the subtotal and then apply the discount.
    const subtotal = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
    let discount = 0;
    if (cart.coupon) {
        if (cart.coupon.discountType === 'percentage') {
            discount = (subtotal * cart.coupon.discountAmount) / 100;
        } else {
            discount = cart.coupon.discountAmount;
        }
    }
    const grandTotal = subtotal - discount;
    const amountStr = grandTotal.toFixed(2);

    const txnid = `txnid_${Date.now()}`;
    const productinfo = 'E-commerce Purchase';

    // Create a preliminary order with the CORRECT discounted total
    const orderItems = cart.items.map(item => ({
        name: item.product.name, quantity: item.quantity, image: item.product.images[0]?.url,
        price: item.product.price, product: item.product._id,
    }));
    await Order.create({
        user: req.user._id, shippingAddress: shippingAddressId, orderItems,
        totalPrice: grandTotal, // Use the final discounted total
        paymentInfo: { id: txnid, status: 'Pending' },
        orderStatus: 'Pending Payment',
    });

    const hashParams = [
        process.env.PAYU_MERCHANT_KEY, txnid, amountStr, productinfo, firstName, email,
        '', '', '', '', '', '', '', '', '', ''
    ];
    const hashString = `${hashParams.join('|')}|${process.env.PAYU_MERCHANT_SALT}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');
    
    // Send the CORRECT discounted amount to the payment gateway
    const paymentData = {
        key: process.env.PAYU_MERCHANT_KEY,
        txnid,
        amount: amountStr, // Use the final discounted amount string
        productinfo,
        firstname: firstName,
        email,
        phone,
        surl: `http://localhost:5000/api/v1/payment/payu/success`,
        furl: `http://localhost:5000/api/v1/payment/payu/failure`,
        hash,
    };

    res.status(200).json({ success: true, paymentData });
});

// @desc    Handle successful PayU payment
export const payuSuccess = asyncHandler(async (req, res) => {
    const { txnid, status } = req.body;
    if (status === 'success') {
        const order = await Order.findOneAndUpdate({ "paymentInfo.id": txnid }, { "paymentInfo.status": status, "orderStatus": "Processing" }, { new: true });
        if (order) {
            // Clear cart and remove applied coupon
            await Cart.updateOne({ user: order.user }, { $set: { items: [], coupon: null } });
        }
    }
    // res.redirect('http://localhost:5173/payment-success');
    res.redirect('https://zenmarket-ecommerce.vercel.app/payment-success');
});

// @desc    Handle failed PayU payment
export const payuFailure = asyncHandler(async (req, res) => {
    const { txnid, status } = req.body;
    await Order.findOneAndUpdate({ "paymentInfo.id": txnid }, { "paymentInfo.status": status, "orderStatus": "Payment Failed" });
    // res.redirect('http://localhost:5173/payment-failure');
    res.redirect('https://zenmarket-ecommerce.vercel.app/payment-failure');

});
