import jwt from "jsonwebtoken";
import User from "../models/user/userModel.js";

const protect = async (req, res, next) => {
  let token;
  // REMOVE: console.log(token); // Logs undefined every time

  // **CORRECTION**: Check for 'Bearer' (capital B)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user still exists
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
         return res.status(401).json({ message: "User no longer exists" });
      }

      next();
    } catch (error) {
      // Log the actual error for debugging (e.g., JWT expired)
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed (Invalid or Expired)" });
    }
  }

  // This check is outside the try block and is fine
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });
};

export default protect;