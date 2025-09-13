const mongoose = require("mongoose");

const UserSchemas = new mongoose.Schema({
  name: { type: String, required: true },
  mailId: { type: String, required: true },
  password: { type: String, required: true },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File", // Reference the File schema
    },
  ],
});

module.exports = mongoose.model("User", UserSchemas);

