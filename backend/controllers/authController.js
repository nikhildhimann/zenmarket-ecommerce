import User from "../models/user/userModel.js";
import generateToken from "../utils/generateToken.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, username, email, phoneNumber, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(400, "User with this email already exists");
    }

    const user = await User.create({ firstName, lastName, username, email, phoneNumber, password, role });

    const token = generateToken(user._id, user.role);
    res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
    });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = generateToken(user._id, user.role);
    res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
    });
});

// @desc    Get user profile data
// @route   GET /api/auth/user/dashboard
// @access  Private
export const getUserDashboard = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json({ success: true, user });
});

// @desc    Update user profile data
// @route   PUT /api/auth/user/dashboard
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, phoneNumber } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    const updatedUser = await user.save();

    res.status(200).json({
        success: true,
        user: updatedUser,
        message: "Profile updated successfully"
    });
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        // To prevent users from checking which emails are registered,
        // we send a generic success message even if the user is not found.
        return res.status(200).json({ message: "If a user with that email exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token is valid for 10 minutes
    await user.save({ validateBeforeSave: false });

    // This creates a link to your frontend's password reset page
    // const resetURL = `http://localhost:5173/resetpassword?token=${resetToken}`;
    const resetURL = `https://zenmarket-ecommerce.vercel.app/resetpassword?token=${resetToken}`;

    // --- Full Email Sending Logic ---
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: `ZenMarket <${process.env.EMAIL_FROM}>`,
            subject: "Password Reset Request",
            html: `<p>You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the following link, or paste this into your browser to complete the process:</p>
                   <p><a href="${resetURL}">${resetURL}</a></p>
                   <p>This link is valid for 10 minutes.</p>
                   <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Password reset link has been sent to your email." });

    } catch (error) {
        console.error("Email sending error:", error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        throw new ApiError(500, "There was an error sending the email. Please try again later.");
    }
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.query;
    const { password } = req.body;

    // Hash the incoming token so we can find it in the database
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Check if the token is still valid
    });

    if (!user) {
      throw new ApiError(400, "Password reset link is invalid or has expired.");
    }

    // Set the new password and clear the reset token fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    // Generate a new login token for the user
    const authToken = generateToken(user._id, user.role);
    res.status(200).json({
      message: "Password updated successfully.",
      token: authToken,
    });
});

