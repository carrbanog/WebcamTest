const express = require("express");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const Video = require("./models/video");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ 프론트엔드 URL 허용
    credentials: true, // ✅ 쿠키, 인증 정보 포함 가능
  })
);
mongoose.connect(process.env.DB_CONNECT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("video"), async (req, res) => {
  console.log("받은 파일: ", req.file);
  if (!req.file) {
    return res.status(400).json({ message: "파일이 없습니다." });
  }

  try {
    const video = new Video({
      fileName: req.file.originalname || `${Date.now()}.webm`,
      mimeType: req.file.mimetype,
    });
    await video.save();
    console.log("db 저장 완료: ", video);
    res
      .status(200)
      .json({ message: "파일 업로드 성공", video: video.toObject() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Db저장 실패" });
  }
});

app.listen(5000, () => console.log("🚀 서버 실행 중: http://localhost:5000"));
