const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utils/sendEmail");
const {
  default: forgetPasswordMailTemplate,
} = require("../../utils/forgetPasswordMailTemplate");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email address",
      });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = resetTokenExpiry;
    await user.save();

    // Generate reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Prepare email content
    const message = forgetPasswordMailTemplate(resetUrl);

    // Send email
    await sendEmail({
      email: user.email,
      title: "Password Reset Request - HELTH-PRO",
      body: message,
    });

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    // If email sending failed, remove the reset token
    if (error.message.includes("Email could not be sent")) {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiry = undefined;
        await user.save();
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || "Error processing password reset request",
    });
  }
};

module.exports = forgotPassword;
