// src/main.js

import { sendFrameToServer } from "./api.js";

const video = document.createElement("video");
video.autoplay = true;
video.playsInline = true;
document.body.appendChild(video);

let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");

async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: { ideal: 320 },
      height: { ideal: 240 },
      frameRate: { ideal: 30 },
    },
  });
  video.srcObject = stream;
  return new Promise((resolve) => (video.onloadedmetadata = () => resolve()));
}

async function sendFrameLoop() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  const imageData = canvas.toDataURL("image/jpeg", 0.6);

  const level = await sendFrameToServer(imageData);
  if (level !== null) {
    console.log(`인식된 레벨: ${level}`);
    // 여기에서 UI 업데이트하거나 알림 처리 가능
  }

  setTimeout(() => requestAnimationFrame(sendFrameLoop), 1000); // 1초 간격
}

window.addEventListener("load", async () => {
  try {
    await setupCamera();
    requestAnimationFrame(sendFrameLoop);
  } catch (e) {
    console.error("초기화 실패:", e);
  }
});
