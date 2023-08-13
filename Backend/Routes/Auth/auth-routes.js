const express = require("express");
const router = express.Router();

router.post("/register");
router.post("/login");
router.post("/verify");
router.get("/user");
router.get("/refresh");
router.post("/logout");
router.post("/forget");
router.get("/forget/:otp");
router.post("/forget/save");

module.exports = router;
