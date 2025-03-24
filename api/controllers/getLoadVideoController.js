const fs = require("fs");
const Video = require("../models/video");
const path = require("path");

const getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    // console.log(videos);
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "영상 목록 가져오기 실패" });
  }
};

const getVideoById = async (req, res) => {
  try {
    // console.log("param", req.params.id);
    const video = await Video.findOne({
      $or: [{ fileName: req.params.id }, { prevFileName: req.params.id }],
    });
    console.log("video", video, "____________________");
    if (!video) {
      return res.status(404).json({ message: "영상이 없습니다." });
    }
    console.log("dirName: ", __dirname);

    let filePath;
    if (req.params.id === video.fileName) {
      filePath = path.resolve(__dirname, "../uploads", video.fileName);
      console.log("videoFilePath: ", filePath);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
      }
      return res.sendFile(filePath);
    }

    // 요청한 ID가 prevFileName과 일치하면 prevFilePath 반환
    if (req.params.id === video.prevFileName) {
      filePath = path.resolve(__dirname, "../uploads", video.prevFileName);
      console.log("prevFilePath: ", filePath);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
      }
      return res.sendFile(filePath);
    }

    // 요청한 ID가 둘 다 아닐 경우
    return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "영상 스트리밍 실패" });
  }
};

module.exports = { getVideos, getVideoById };
