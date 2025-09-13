const express = require("express");
const router = express.Router();
const Loggedin = require("../Controllers/Login.js");

router.post("/user/login", Loggedin);

module.exports = router;
