const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const IsAuth = async (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader) {
      return res.status(403).json({ message: "Please login to access." });
    }

    // Extract token from the "Bearer <token>" format
    const token = authHeader.split(" ")[1];  // This will get the token part after 'Bearer'
    if (!token) {
      return res.status(403).json({ message: "Token missing or invalid." });
    }

    // Verify the token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedData || !decodedData._id) {
      return res.status(403).json({ message: "Invalid token." });
    }

    // Fetch the user from the database
    const user = await User.findById(decodedData._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Attach user object to the request
    req.user = user;
    next();
  } catch (error) {
    // Specific error handling for JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token." });
    } else if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired." });
    }

    // General error handling
    return res.status(500).json({ message: error.message });
  }
};

module.exports = IsAuth;
