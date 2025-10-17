import mongoose from "mongoose"; // Changed the import for clarity
import bcrypt from "bcrypt";

// 1. **CORRECTION**: Define userSchema directly as a new Mongoose.Schema instance.
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// middleware to hash password
// 2. This is now called on a Schema object and will work.
userSchema.pre("save", async function (next) {
  // Check if password field is being modified
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 3. **CORRECTION**: Pass the schema object to mongoose.model()
const User = mongoose.model("User", userSchema);

export default User;
