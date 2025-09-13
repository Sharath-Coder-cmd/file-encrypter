const express = require("express");
const router = express.Router();
const { getAllFiles } = require("../Controllers/FileController");
const authMiddleware = require("../Controllers/IsAuth");

// GET /api/files - Fetch all files for the authenticated user
router.get("/files", authMiddleware, getAllFiles);

module.exports = router;
