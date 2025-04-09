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
// app.use("/gesture", post);

// app.post("/upload", upload.single("video"), async (req, res) => {
//   console.log("받은 파일: ", req.file);
//   const { latitude, longitude } = req.body;
//   if (!req.file) {
//     return res.status(400).json({ message: "파일이 없습니다." });
//   }

//   try {
//     const video = new Video({
//       fileName: req.file.originalname || `${Date.now()}.webm`,
//       mimeType: req.file.mimetype,
//       latitude: latitude,
//       longitude: longitude,
//     });
//     await video.save();
//     console.log("db 저장 완료: ", video);
//     res
//       .status(200)
//       .json({ message: "파일 업로드 성공", video: video.toObject() });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Db저장 실패" });
//   }
// });

// app.get("/videos", async (req, res) => {
//   try {
//     const videos = await Video.find();
//     console.log(videos);
//     res.json(videos);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "영상 목록 가져오기 실패" });
//   }
// });

// app.get("/video/:id", async (req, res) => {
//   try {
//     const video = await Video.findById(req.params.id);
//     if (!video) {
//       return res.status(404).json({ message: "영상이 없습니다." });
//     }

//     const filePath = `uploads/${video.fileName}`;
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
//     }

//     res.sendFile(filePath, { root: "." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "영상 스트리밍 실패" });
//   }
// });

// app.post("/send-sms", async (req, res) => {
//   const { to, message } = req.body;
//   console.log(req.body);

//   try {
//     const response = await client.messages.create({
//       body: message,
//       from: twilioPhoneNumber,
//       to: phoneNum,
//     });
//     console.log(response);
//     res.json({ success: true, sid: response.sid });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

app.listen(5000, () => console.log("🚀 서버 실행 중: http://localhost:5000"));
