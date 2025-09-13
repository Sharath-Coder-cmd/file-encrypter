const File = require("../Models/File");

const getAllFiles = async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from authenticated request

    // Fetch the files from the database for the authenticated user
    const files = await File.find({ userId }); // Only filter by userId

    // Check if any files were found
    if (files.length === 0) {
      return res.status(404).json({ message: "No files found." });
    }

    // Return the files found in the database
    res.status(200).json({ files });
  } catch (error) {
    // Handle any errors that may occur during the file retrieval process
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllFiles };
