const express = require("express");

const { register, login, verifytoken, getuser, verifyRefreshToken, refresh, logout, generate, verify, forget, forgetIsValid, forget_save } = require("../controllers/Auth/auth-controller");
const { verification, isOTP } = require("../controllers/Validators/Auth/validators");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", verifytoken, getuser);
router.get("/refresh", verifyRefreshToken, refresh);
router.post("/logout", verifytoken, logout);
router.post("/generate", verifytoken, verification, generate);
router.post("/verify", verifytoken, verification, isOTP, verify);
router.post("/forget", forget);
router.get("/forget/:otp", forgetIsValid);
router.post("/forget/save", forget_save);

module.exports = router;