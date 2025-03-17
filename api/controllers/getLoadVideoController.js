const fs = require("fs");
const Video = require("../models/video");

const getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    console.log(videos);
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "영상 목록 가져오기 실패" });
  }
};

const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "영상이 없습니다." });
    }

    const filePath = `uploads/${video.fileName}`;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
    }

    res.sendFile(filePath, { root: "." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "영상 스트리밍 실패" });
  }
};

module.exports = { getVideos, getVideoById };
