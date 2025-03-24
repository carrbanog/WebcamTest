const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const uploadVideo = require("../controllers/postUploadController");

const router = express.Router();

// const upload = multer({ dest: "uploads/" });

// router.route("/").post(upload.single("video"), uploadVideo);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve(__dirname, "../uploads");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    let fileName;

    if (file.fieldname === "prevVideo") {
      fileName = "prevVideo1" + fileExt;
      let fileNumber = 1;

      // prevVideo 파일명 중복 체크
      while (fs.existsSync(path.resolve(__dirname, "../uploads", fileName))) {
        fileNumber++;
        fileName = `prevVideo${fileNumber}${fileExt}`;
      }
    } else if (file.fieldname === "video") {
      fileName = "video1" + fileExt;
      let fileNumber = 1;

      // video 파일명 중복 체크
      while (fs.existsSync(path.resolve(__dirname, "../uploads", fileName))) {
        fileNumber++;
        fileName = `video${fileNumber}${fileExt}`;
      }
    }

    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.route("/").post(
  upload.fields([
    { name: "prevVideo", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  uploadVideo
);

module.exports = router;
