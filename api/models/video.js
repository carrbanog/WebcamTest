const mongoose = require("mongoose");
const { Schema } = mongoose;

const VideoSchema = new mongoose.Schema({
  fileName: String,
  prevFileName: String,
  mimeType: String,
  uploadDate: { type: Date, default: Date.now },
  latitude: Number,
  longitude: Number,
});
const Video = mongoose.model("Video", VideoSchema);

module.exports = Video;
