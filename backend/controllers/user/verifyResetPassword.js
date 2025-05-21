const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const verifyResetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      user.resetPasswordToken !== token ||
      !user.resetPasswordTokenExpiry ||
      user.resetPasswordTokenExpiry < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "Reset token has expired",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error resetting password",
    });
  }
};

module.exports = verifyResetPassword;
