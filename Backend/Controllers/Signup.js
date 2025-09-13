const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User.js");
const sendMail = require("./sendMail");
const validator = require("validator");

const registerUser = async (req, res) => {
  try {
    const name = validator.escape(req.body.name);
    const mailId = validator.normalizeEmail(req.body.mailId);
    const password = req.body.password;

    if (!mailId.endsWith("@gmail.com")) {
      return res.status(400).json({ message: "Email must end with @gmail.com!" });
    }

    if (!validator.isEmail(mailId)) {
      return res.status(400).json({ message: "Invalid email format!" });
    }

    let user = await User.findOne({ mailId });
    if (user) {
      return res.status(400).json({ message: "User Already Exists!!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let otp;
    while (!otp || otp.toString().length !== 6) {
      otp = Math.floor(Math.random() * 1000000);
    }

    const activationToken = jwt.sign(
      { user: { name, mailId, hashedPassword }, otp },
      process.env.ACTIVATION_CODE,
      { expiresIn: "5m" }
    );

    const message = `Please verify your account using OTP: ${otp}`;
    await sendMail(mailId, "Thanks for choosing File Encrypter", message);

    return res.status(200).json({ message: "OTP sent successfully", activationToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = registerUser;
