const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const path=require("path")
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const app = express();

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (15 mins)
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Routers
const userRoutes = require("./Routes/NewUser.js");
const loginRoutes = require("./Routes/LoginUser.js");
const profileRoutes = require("./Routes/UserProfile.js");
const allFiles = require("./Routes/FileRoutes.js");
const encryptRoutes = require("./Routes/Encrypt2.js");
const decryptRoutes = require("./Routes/Decrypt.js");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("./uploads", express.static(path.join(__dirname, "uploads")));
app.use("/decrypted", express.static(path.join(__dirname, "decrypted")));
app.use(bodyParser.json());
app.use(helmet());
app.use(limiter);
app.use(xss());

// Database connection
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("DB is connected successfully");
  })
  .catch((err) => console.error("DB connection error:", err));

// Route registration
app.use("/api", userRoutes);
app.use("/api", loginRoutes);
app.use("/api", profileRoutes);
app.use("/api", allFiles);
app.use("/api/encrypt", encryptRoutes);
app.use("/api", decryptRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
