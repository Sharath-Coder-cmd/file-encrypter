const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    filePath: { type: String, required: true },
    encrypted: { type: Boolean, required: true, default: true },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    encryptionKeyHash: {
      type: String,
      required: true,
    },
    iv: { type: String, required: true }, // Add the IV field to store the initialization vector
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", FileSchema);
