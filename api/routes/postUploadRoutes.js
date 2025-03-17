const express = require("express");
const multer = require("multer");
const uploadVideo = require("../controllers/postUploadController");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.route("/").post(upload.single("video"), uploadVideo);

module.exports = router;
