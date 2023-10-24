const express = require("express");
const { verifytoken } = require("../controllers/Auth/auth-controller");
const { isAdmin } = require("../controllers/Validators/Auth/validators");
const { addEvents, getEvents, getEvent, updateEvent } = require("../controllers/Events/events-controller");

const router = express.Router();

router.post("/add", verifytoken, isAdmin, addEvents);
router.get("/", getEvents);
router.get("/:id", getEvent);
router.delete("/:id", updateEvent);

module.exports = router;