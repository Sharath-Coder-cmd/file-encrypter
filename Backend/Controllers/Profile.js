const User = require("../Models/User");
const File = require("../Models/File");

const Profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch file details from the File schema
    const files = await File.find({ userID: user._id });

    return res.status(200).json({
      user: {
        name: user.name,
        email: user.mailId,
        files, // Send the full file details
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = Profile;
