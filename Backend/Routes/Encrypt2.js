const express = require("express");
const multer = require("../Middlewares/multer"); // Import shared multer setup
const { encryptFileHandler } = require("../Controllers/FIleEncrypt2"); // Adjust the path to your controller file

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }))
router.post("/", multer.single("file"), encryptFileHandler);

module.exports = router;
