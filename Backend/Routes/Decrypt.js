const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { decryptFileHandler } = require("../Controllers/FileDecrypt");  
const jwt = require("jsonwebtoken");
const File = require("../Models/File");
const mime = require("mime-types");

router.post("/decrypt", async (req, res) => {
  const { fileId, userId, filePassword } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!fileId || !userId || !filePassword || !token) {
    return res.status(400).json({ message: "Missing required parameters or token." });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken._id !== userId) {
      return res.status(403).json({ message: "Unauthorized access." });
    }

    const file = await File.findOne({ _id: fileId, userID: userId });

    if (!file || !file.filePath || !file.encryptionKeyHash || !file.iv) {
      return res.status(404).json({ message: "File not found or metadata incomplete." });
    }

    // Decrypt the file and get the decrypted path
    const decryptedFilePath = await decryptFileHandler(file, filePassword);

    // Check MIME type for the decrypted file
    const mimeType = mime.lookup(decryptedFilePath) || "application/octet-stream";

    // Send the decrypted file as a stream in the response
    const decryptedFileStream = fs.createReadStream(decryptedFilePath);
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${path.basename(decryptedFilePath)}"`);

    decryptedFileStream.pipe(res);

    // Restore the file to ".enc" after 5 minutes
    setTimeout(() => {
      if (fs.existsSync(decryptedFilePath)) {
        fs.renameSync(decryptedFilePath, file.filePath);
        console.log("File restored:", file.filePath);
      }
    }, 5 * 60 * 1000); // 5 minutes

  } catch (error) {
    console.error("Error during file decryption:", error.message);
    res.status(500).json({ message: "An error occurred during file decryption.", error: error.message });
  }
});

module.exports = router;
