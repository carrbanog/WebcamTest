const mongoose = require("mongoose");
const { Schema } = mongoose;

const VideoSchema = new mongoose.Schema({
  fileName: String,
  mimeType: String,
  uploadDate: { type: Date, default: Date.now },
});
const Video = mongoose.model("Video", VideoSchema);

module.exports = Video;
