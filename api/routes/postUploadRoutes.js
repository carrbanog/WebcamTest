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
    const uploadDir = path.resolve(__dirname, "../uploads"); // uploads 폴더 경로
    cb(null, uploadDir); // uploads 폴더로 파일 저장
  },
  filename: (req, file, cb) => {
    let fileNumber = 1;
    let fileName = `video${fileNumber}.webm`; // video1.webm

    // 같은 이름의 파일이 존재하는지 확인
    while (fs.existsSync(path.resolve(__dirname, "../uploads", fileName))) {
      fileNumber++; // 파일 번호 증가
      fileName = `video${fileNumber}.webm`; // video2.webm, video3.webm 등으로 변경
    }

    cb(null, fileName); // 파일 이름 설정
  },
});

const upload = multer({ storage: storage });

router.route("/").post(upload.single("video"), uploadVideo);

module.exports = router;
