const User = require("../models/users");
const { validateEmail } = require("../utills/emailValidator");
const { validateRequiredFields } = require("../utills/validateRequiredFields");
const bcryptjs = require("bcryptjs");
const sendEmail = require("../utills/sendEmail");
const { Op } = require("sequelize"); 


exports.register = async (req, res) => {
  try {
    const { fullName, email, role, password } = req.body;

    const requiredFields = ["fullName", "email", "role", "password"];
    const missingFieldMessage = validateRequiredFields(requiredFields, req.body);
    if (missingFieldMessage) {
      return res.status(400).json({
        success: false,
        message: missingFieldMessage,
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email is not valid",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    await User.create({
      fullName,
      email: email.toLowerCase(),
      role,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    const user = await User.findOne({
      where: {
        email: email.toLowerCase(),
        permanentDeleted: false,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found with this email",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = user.createJWT();

    const userData = await User.findOne({
      where: { email: email.toLowerCase(), permanentDeleted: false },
      attributes: {
        exclude: [
          "password",
          "setNewPwd",
          "forgotPasswordOtp",
          "forgotPasswordOtpExpire",
        ],
      },
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



exports.forgetPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Please Provide Email" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: "Please Provide Valid Email" });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase(), permanentDeleted: false } });
    if (!user) {
      return res.status(400).json({ success: false, message: "No User With This Email" });
    }

    const otp = (Math.floor(Math.random() * 899999) + 100000).toString();
    const hashedOTP = await bcryptjs.hash(otp, 10);

    await user.update({
      forgotPasswordOtp: hashedOTP,
      forgotPasswordOtpExpire: Date.now() + 5 * 60 * 1000,
    });

    await sendEmail({
      to: email,
      subject: "Forget Password OTP",
      html: `Your Forgot Password OTP Is ${otp}`,
    });

    return res.status(200).json({ success: true, message: "OTP Has been sent to your email" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};


exports.verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { email, forgotPasswordOtp } = req.body;
    if (!email || !forgotPasswordOtp) {
      return res.status(400).json({ success: false, message: "Please Provide Email & OTP" });
    }

    const user = await User.findOne({
      where: {
        email: email.toLowerCase(),
        permanentDeleted: false,
      forgotPasswordOtpExpire: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Session Expired" });
    }

    const isValid = await user.compareForgotPasswordOtp(forgotPasswordOtp);

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    await user.update({ setNewPwd: true });

    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Please Provide Email" });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase(), permanentDeleted: false } });

    if (!user?.setNewPwd) {
      return res.status(400).json({
        success: false,
        message: "You are not allowed to do that operation",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Password & Confirm Password",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password & Confirm Password Are Not Same",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    await user.update({ password: hashedPassword, setNewPwd: false });

    return res.status(200).json({ success: true, message: "Password Updated Successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email.toLowerCase(), permanentDeleted: false } });

    if (!user) {
      return res.status(400).json({ success: false, message: "Wrong email" });
    }

    const otp = (Math.floor(Math.random() * 899999) + 100000).toString();
    const hashedOtp = await bcryptjs.hash(otp, 10);

    await user.update({
      forgotPasswordOtp: hashedOtp,
      forgotPasswordOtpExpire: Date.now() + 5 * 60 * 1000,
    });

    await sendEmail({
      to: email,
      subject: "Forget Password OTP",
      html: `Your Forgot Password OTP Is ${otp}`,
    });

    return res.status(200).json({ success: true, message: "OTP has been sent to you" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
