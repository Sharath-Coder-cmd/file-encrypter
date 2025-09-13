const crypto = require("crypto");
const fs = require("fs");
const path = require("path"); // Import path module
const File = require("../Models/File");
const User = require("../Models/User");

const encryptFile = (filePath, password) => {
  const algorithm = "aes-256-ctr";
  const key = crypto.createHash("sha256").update(password).digest();
  const iv = crypto.randomBytes(16); // Generate a random IV

  const input = fs.createReadStream(filePath);
  const output = fs.createWriteStream(`${filePath}.enc`); // Output encrypted file
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  return new Promise((resolve, reject) => {
    input
      .pipe(cipher)
      .pipe(output)
      .on("finish", () => {
        fs.unlinkSync(filePath); // Remove original file after encryption
        resolve({ encryptedPath: `${filePath}.enc`, iv: iv.toString("hex") }); // Return encrypted path and iv
      })
      .on("error", reject);
  });
};

exports.encryptFileHandler = async (req, res) => {
  try {
    const { filePassword, userID } = req.body;

    if (!filePassword || !userID) {
      return res
        .status(400)
        .json({ message: "filePassword and userID are required." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const fileType = req.file.mimetype;

    // Encrypt the file
    const { encryptedPath, iv } = await encryptFile(filePath, filePassword);

    const encryptionKeyHash = crypto
      .createHash("sha256")
      .update(filePassword)
      .digest("hex");

    // Validate that `encryptedPath` and `iv` are defined
    if (!encryptedPath || !iv) {
      return res.status(500).json({
        message: "Missing filePath or iv in the file record.",
      });
    }

    // Save the file details in the database
    const newFile = new File({
      fileName,
      fileType,
      fileSize,
      filePath: encryptedPath, // Store path to the encrypted file
      userID, // Store user ID
      encryptionKeyHash, // Store hashed encryption key
      iv, // Store iv for decryption
    });

    await newFile.save();

    // Update the user's file list with encryptionKeyHash and iv
    const user = await User.findById(userID); // Fetch the user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Add the encrypted file to the user's file list with encryptionKeyHash and iv
    user.files.push(newFile._id); // Store only the file ID

    await user.save(); // Save the updated user

    res.status(201).json({
      message: "File uploaded and encrypted successfully.",
      file: {
        fileName,
        filePath: encryptedPath,
        fileID: newFile._id, // Return file ID for reference
      },
    });
  } catch (error) {
    console.error("Error during encryption:", error);
    res.status(500).json({
      message: "An error occurred during file encryption.",
      error: error.message,
    });
  }
};
