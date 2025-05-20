const express = require("express");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const Video = require("./models/video");
const nodemailer = require("nodemailer");
require("dotenv").config();
const videoRoutes = require("./routes/postUploadRoutes");
const getLoadVideoRoutes = require("./routes/getLoadVideoRoutes");
const postSendRouter = require("./routes/postSendRoutes");

const app = express();
const local = "http://localhost:5173";
const build = "http://localhost:3000";

app.use(
  cors({
    origin: local, // ✅ 프론트엔드 URL 허용
    credentials: true, // ✅ 쿠키, 인증 정보 포함 가능
  })
);
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("✔️ MongoDB 연결 성공!");
  })
  .catch((err) => {
    console.error("🚨 MongoDB 연결 실패:", err.message);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

app.use("/upload", videoRoutes);
app.use("/videos", getLoadVideoRoutes);
app.use("/send-sms", postSendRouter);

app.listen(5000, () => console.log("🚀 서버 실행 중: http://localhost:5000"));
