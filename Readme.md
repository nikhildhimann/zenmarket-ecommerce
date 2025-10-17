ZenMarket - Full-Stack E-commerce Platform

Welcome to ZenMarket, a modern, feature-rich e-commerce application built with the MERN stack. This project showcases a complete online shopping experience, from browsing products to real-time order notifications, all wrapped in a sleek, responsive design.

✨ Key Features

Modern & Responsive UI: Beautiful, premium design that works on all devices, with a toggle for Light/Dark Mode.

Full E-commerce Flow: Browse products, add to cart, apply coupons, and complete the checkout process with a secure payment gateway.

Advanced Product Filtering: Filter products by category and brand, and sort by price or name.

Secure User Authentication: Robust user registration and login system with password reset functionality via email.

Personalized User Experience: Users can manage their profile, view order history, and maintain a persistent wishlist.

Powerful Admin Dashboard: A comprehensive admin panel with analytics charts (Total Revenue, Sales Trends), and full CRUD management for products, orders, and coupons.

Real-Time Admin Notifications: Admins receive instant pop-up notifications for new orders via Socket.io.

Automated Email Notifications: Customers receive an email confirmation upon successful payment.

PWA Ready: The application is installable on mobile devices for a native-app-like experience.

🛠️ Tech Stack

Frontend

Framework: React 19 with Vite

UI Library: Material-UI (MUI) for a modern component library.

State Management: Redux Toolkit for a centralized and predictable state container.

Routing: React Router for client-side navigation.

API Communication: Axios for handling HTTP requests.

Data Visualization: Recharts for creating beautiful dashboard charts.

Real-Time: Socket.io-client to receive live notifications.

Backend

Runtime: Node.js

Framework: Express.js

Database: MongoDB with Mongoose for object data modeling.

Authentication: JSON Web Tokens (JWT) for secure, stateless authentication.

Security: Bcrypt for password hashing.

File Storage: Cloudinary for cloud-based image hosting.

Email Service: Nodemailer for sending transactional emails.

Real-Time: Socket.io for event-based communication.

🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites

Node.js (v18 or higher recommended)

npm (or yarn)

MongoDB (a local instance or a free cloud account on MongoDB Atlas)

Installation & Setup

Clone the repository:

git clone [https://github.com/nikhildhimann/zenmarket-ecommerce.git](https://github.com/nikhildhimann/zenmarket-ecommerce.git)
cd zenmarket-ecommerce


Set up the Backend:

Navigate to the backend directory:

cd backend


Install the dependencies:

npm install


Create a .env file in the backend root. This file will hold your secret keys. Copy the contents of .env.example into it and fill in your values.

Set up the Frontend:

Navigate to the frontend directory from the root:

cd frontend


Install the dependencies:

npm install


Environment Variables (.env)

Your backend .env file should look like this. Do not commit this file to GitHub.

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=5d

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Nodemailer (for password reset emails)
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
EMAIL_FROM=youremail@example.com

# PayU (if applicable)
PAYU_MERCHANT_KEY=your_payu_key
PAYU_MERCHANT_SALT=your_payu_salt


🏃 Running the Application

You will need two separate terminals to run both the frontend and backend servers simultaneously.

Start the Backend Server:

Navigate to the backend directory:

cd backend


Run the development server:

npm run dev


The server will start on http://localhost:5000 (or the port you specified).

Start the Frontend Development Server:

Navigate to the frontend directory:

cd frontend


Run the development server:

npm run dev


The React app will open automatically in your browser at http://localhost:5173.

This project was developed to showcase a complete and modern full-stack application, demonstrating best practices in both frontend and backend development.
