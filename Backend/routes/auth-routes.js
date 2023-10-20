const express = require("express");

const { register, login, verifytoken, getuser, verifyRefreshToken, refresh, logout } = require("../controllers/Auth/auth-controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", verifytoken, getuser);
router.get("/refresh", verifyRefreshToken, refresh);
router.post("/logout", verifytoken, logout);

module.exports = router;