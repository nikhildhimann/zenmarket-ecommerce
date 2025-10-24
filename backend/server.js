    import dotenv from "dotenv";
    dotenv.config();

    import express from "express";
    import http from 'http';
    import { Server } from 'socket.io';
    import cors from 'cors';
    import connectDB from "./config/db.js"; // Ensure path is correct
    import { errorHandler } from './middlewares/errorHandler.js'; // Ensure path is correct

    // Import all your route files (ensure paths are correct)
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
    const allowedOrigins = [
        'http://localhost:5173', // For local development
        'https://zenmarket-ecommerce.vercel.app' // Replace with your ACTUAL Vercel URL
    ];

    const corsOptions = {
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS: ' + origin)); // Log the blocked origin
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true // If you need cookies/sessions
    };

    const io = new Server(server, {
        cors: corsOptions
    });

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        req.io = io;
        next();
    });

    // --- API Routes ---
    // Health check endpoint
    app.get("/api/health", (req, res) => {
        res.status(200).send("Backend is healthy!");
    });
    
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
        process.exit(1); // Exit if DB connection fails
      });
    
