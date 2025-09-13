const express = require("express");
const router = express.Router();
const Profile = require("../Controllers/Profile");
const IsAuth=require("../Controllers/IsAuth")

router.get("/user/profile", IsAuth,Profile);

module.exports = router;
