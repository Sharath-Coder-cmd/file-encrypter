const jwt = require("jsonwebtoken");
const User = require("../Models/User.js");

const verifyOtp = async (req, res) => {
  try {
    const { otp, activationToken } = req.body;

    let verify;
    try {
      verify = jwt.verify(activationToken, process.env.ACTIVATION_CODE);
    } catch (err) {
      return res.status(400).json({ message: "OTP Expired or Invalid" });
    }

    if (!verify) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    if (verify.otp !== otp) {
      return res.status(400).json({ message: "Wrong OTP" });
    }

    const existingUser = await User.findOne({ mailId: verify.user.mailId });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await User.create({
      name: verify.user.name,
      mailId: verify.user.mailId,
      password: verify.user.hashedPassword,
    });

    return res.status(200).json({ message: "User Created Successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error.stack);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = verifyOtp;
