import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from "./config/db.js";
import { errorHandler } from './middlewares/errorHandler.js';

// Import all your route files
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/user/userRoutes.js";
import productRoutes from "./routes/product/productRoutes.js";
import categoryRoutes from "./routes/product/categoryRoutes.js";
import brandRoutes from "./routes/product/brandRoutes.js";
import reviewRoutes from "./routes/review/reviewRoutes.js";
import cartRoutes from "./routes/cart/cartRoute.js";
import wishlistRoutes from "./routes/wishlist/wishlistRoute.js";
import addressRoutes from "./routes/address/addressRoutes.js";
import orderRoutes from "./routes/order/orderRoutes.js";
import paymentRoutes from "./routes/payment/paymentRoutes.js";
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import analyticsRoutes from './routes/analytics/analyticsRoute.js';
import couponRoutes from './routes/coupon/couponRoute.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.io = io;
    next();
});

// --- API Routes ---
// ✨ FIX: Placed the more specific '/api/auth/user' route BEFORE the general '/api/auth' route.
app.use("/api/auth/user", userRoutes); 
app.use("/api/auth", authRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/coupon', couponRoutes);

io.on('connection', (socket) => {
    console.log('A user connected via WebSocket:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
  })
  .catch((error) => {
    console.log(`Server connection error: ${error.message}`);
  });

