const express = require("express");

const { verifytoken } = require("../controllers/Auth/auth-controller");
const { isAdmin } = require("../controllers/Validators/Auth/validators");
const { emailLogs, contact } = require("../controllers/Emails/email-controller");

const router = express.Router();

router.get("/logs", verifytoken, isAdmin, emailLogs);
router.post("/contact", verifytoken,contact);
module.exports = router;