const express = require("express");
const router = express.Router();
const postUploadController = require("../controllers/postUploadController");

router.route("/").post(postUploadController);
