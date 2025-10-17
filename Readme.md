ZenMarket - Full-Stack E-commerce Platform

Welcome to ZenMarket, a modern, feature-rich e-commerce application built with the MERN stack. This project showcases a complete online shopping experience, from browsing products to real-time order notifications, all wrapped in a sleek, responsive design.

✨ Features

Modern & Responsive UI: Beautiful, premium design that works on all devices, with a toggle for Light/Dark Mode.

Full-Featured E-commerce Flow: Browse products, add to cart, apply coupons, and complete the checkout process.

Advanced Product Management: Filter by category/brand and sort by price/name.

User Authentication: Secure user registration and login, with password reset functionality.

Personalized User Experience: Users can manage their profile, view order history, and maintain a wishlist.

Admin Dashboard: A powerful admin panel with analytics charts (Total Revenue, Sales Trends), and management sections for products, orders, and coupons.

Real-Time Notifications: Admins receive instant notifications for new orders via Socket.io.

Email Notifications: Customers receive an email confirmation upon successful payment.

PWA Support: The application is installable on mobile devices for a native-app-like experience.

🛠️ Tech Stack

Frontend:

React 19

Vite

Material-UI (MUI) for component styling

Redux Toolkit for state management

React Router for navigation

Axios for API requests

Recharts for data visualization

Socket.io-client for real-time communication

Backend:

Node.js

Express.js

MongoDB with Mongoose

JSON Web Tokens (JWT) for authentication

Bcrypt for password hashing

Cloudinary for image hosting

Nodemailer for sending emails

Socket.io for real-time communication

🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

Prerequisites

Node.js (v18 or higher)

npm

MongoDB (local or a cloud instance like MongoDB Atlas)

Installation & Setup

Clone the repository:

git clone [https://github.com/nikhildhimann/zenmarket-ecommerce.git](https://github.com/nikhildhimann/zenmarket-ecommerce.git)
cd ecommerce-fullstack-app


Set up the Backend:

cd backend
npm install


Create a .env file in the backend root and add your environment variables (database URI, JWT secret, Cloudinary keys, SMTP details, etc.).

Set up the Frontend:

cd ../frontend
npm install


Running the Application

Start the Backend Server:

cd backend
npm run dev


The server will start on http://localhost:5000 (or your specified port).

Start the Frontend Development Server:

cd frontend
npm run dev


The React app will open in your browser at http://localhost:5173.

This project was developed to showcase a complete and modern full-stack application.