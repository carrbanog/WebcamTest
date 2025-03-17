const express = require("express");
const {
  getVideoById,
  getVideos,
} = require("../controllers/getLoadVideoController");

const router = express.Router();

router.get("/", getVideos);
router.get("/", getVideoById);

module.exports = router;
