const Video = require("../models/video");

const uploadVideo = async (req, res) => {
  console.log("받은 파일: ", req.file);
  const { latitude, longitude } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: "파일이 없습니다." });
  }

  try {
    const video = new Video({
      fileName: req.file.originalname || `${Date.now()}.webm`,
      mimeType: req.file.mimetype,
      latitude: latitude,
      longitude: longitude,
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
};
module.exports = uploadVideo;
