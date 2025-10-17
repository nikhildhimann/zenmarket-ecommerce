import { asyncHandler } from "../../utils/asyncHandler.js";
import Order from "../../models/order/orderModel.js";
import User from "../../models/user/userModel.js";
import Product from "../../models/product/productModel.js";
import moment from 'moment';

// @desc    Get key analytics stats for the admin dashboard
// @route   GET /api/v1/analytics/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
    const { userId } = req.query;

    const baseOrderQuery = {};
    if (userId) {
        baseOrderQuery.user = userId;
    }

    // ✨ FIX: Define "successful" consistently for all calculations.
    // An order contributes to revenue as soon as it's successfully paid for ('Processing').
    const successfulOrderStatuses = ['Processing', 'Shipped', 'Delivered'];

    // Use the consistent status list for the revenue calculation.
    const totalRevenueResult = await Order.aggregate([
        { $match: { ...baseOrderQuery, orderStatus: { $in: successfulOrderStatuses } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;
    
    // This calculation was already correct.
    const successfulOrdersCount = await Order.countDocuments({ ...baseOrderQuery, orderStatus: { $in: successfulOrderStatuses } });
    const failedOrdersCount = await Order.countDocuments({ ...baseOrderQuery, orderStatus: { $in: ['Cancelled', 'Payment Failed'] } });

    const totalProductsSoldResult = await Order.aggregate([
        { $match: { ...baseOrderQuery, orderStatus: { $in: successfulOrderStatuses } } },
        { $unwind: "$orderItems" },
        { $group: { _id: null, total: { $sum: "$orderItems.quantity" } } }
    ]);
    const totalProductsSold = totalProductsSoldResult.length > 0 ? totalProductsSoldResult[0].total : 0;

    const salesData = await Order.aggregate([
        { $match: { ...baseOrderQuery, orderStatus: { $in: successfulOrderStatuses } } },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                totalRevenue: { $sum: "$totalPrice" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    
    const monthlySales = salesData.map(item => ({
        month: moment(`${item._id.year}-${item._id.month}-01`).format('MMM YYYY'),
        revenue: item.totalRevenue
    }));

    let allUsers = [];
    if (!userId) {
        allUsers = await User.find({ role: 'user' }).select('username _id').sort({ username: 1 });
    }

    res.status(200).json({
        success: true,
        stats: {
            totalRevenue,
            successfulOrdersCount,
            failedOrdersCount,
            totalProductsSold,
            monthlySales,
            allUsers
        }
    });
});

