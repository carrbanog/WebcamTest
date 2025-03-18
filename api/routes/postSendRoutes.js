const express = require("express");
const sendSMS = require("../controllers/postSendController");

const router = express.Router();

router.post("/", sendSMS);

module.exports = router;
