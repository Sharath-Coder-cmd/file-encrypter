const express = require("express");
const router = express.Router();
const registerUser = require("../Controllers/Signup.js");
const verifyUser=require("../Controllers/Verify.js")

router.post("/user/signup", registerUser);
router.post("/user/verify", verifyUser);



module.exports = router;
