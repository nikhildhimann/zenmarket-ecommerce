import User from "../models/user/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new admin
// @route   POST /api/admin/auth/register
// @access  Public (should be protected in production)
export const registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, username, email, phoneNumber, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    const admin = await User.create({
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      password,
      role: 'admin', // Explicitly set role to admin
    });

    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Auth admin & get token
// @route   POST /api/admin/auth/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'admin' }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials or not an admin" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};