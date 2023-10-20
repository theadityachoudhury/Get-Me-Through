const express = require("express");

const { register, login, verifytoken, getuser, verifyRefreshToken, refresh, logout, generate, verify } = require("../controllers/Auth/auth-controller");
const { verification, isOTP } = require("../controllers/Validators/Auth/validators");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", verifytoken, getuser);
router.get("/refresh", verifyRefreshToken, refresh);
router.post("/logout", verifytoken, logout);
router.post("/generate", verifytoken, verification, generate);
router.post("/verify", verifytoken, verification, isOTP, verify);

module.exports = router;