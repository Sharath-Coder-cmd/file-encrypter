const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const exitingUser = async (req, res) => {
  try {
    const { mailId, password } = req.body;

    let user = await User.findOne({ mailId });
    if (!user) {
      return res.status(400).json({ message: "User Not Exists" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Wrong Password" });
    }

    // Use the user's _id for generating the JWT
    const token = jwt.sign(
      { _id: user._id }, // Corrected to user._id
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "5h" }
    );

    // Exclude the password from the user object
    const { password: userPassword, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({
      token,
      user: userWithoutPassword,
      message: "Successfully Logged In",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


module.exports = exitingUser;
