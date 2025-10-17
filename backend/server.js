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

// --- CORS Configuration for Deployment ---
// This list defines which frontend URLs are allowed to make requests to your API.
const allowedOrigins = [
    'http://localhost:5173', // Your local frontend for development
    // Add your live Vercel frontend URL here once you deploy it.
    // Example: 'https://zenmarket-frontend.vercel.app' 
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
};

const io = new Server(server, {
    cors: corsOptions // Use the same CORS options for Socket.io
});

app.use(cors(corsOptions)); // Use the CORS options for all Express routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to make the `io` instance available to your controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// --- API Routes ---
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

// --- Socket.io Connection Logic ---
io.on('connection', (socket) => {
    console.log('A user connected via WebSocket:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Centralized Error Handler (must be the last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to the database and then start the server
connectDB()
  .then(() => {
    server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
  })
  .catch((error) => {
    console.log(`Server connection error: ${error.message}`);
  });

