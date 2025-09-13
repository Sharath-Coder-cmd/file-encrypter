const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: "Please login to access." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Proceed to the next middleware/handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
