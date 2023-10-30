const express = require("express");

const { register, login, verifytoken, getuser, verifyRefreshToken, refresh, logout, generate, verify, forget, forgetIsValid, forget_save, updateUser } = require("../controllers/Auth/auth-controller");
const { verification, isOTP, validateUsername, validateEmail } = require("../controllers/Validators/Auth/validators");

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
router.get("/checkUsername/:username", async (req, res, next) => {
    return res.status(200).send(await validateUsername(req.params.username));
});
router.get("/checkEmail/:email", async (req, res, next) => {
    return res.status(200).send(await validateEmail(req.params.email));
});
router.post("/update", verifytoken, updateUser);
module.exports = router;