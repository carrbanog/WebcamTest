import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const PackageWebcam = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);

  console.log(webcamRef);
  console.log(mediaRecorderRef);

  const startRecording = () => {
    setRecording(true);
    const stream = webcamRef.current.stream;
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorderRef.current.ondataavailable = (event) =>
      chunks.push(event.data);
    mediaRecorderRef.current.onstop = () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      setVideoBlob(videoBlob);
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
  };

  return (
    <div>
      <h2>📷 노트북 웹캠</h2>
      <Webcam
        ref={webcamRef}
        audio={false} // 🎤 마이크 비활성화 (원하면 true로 변경)
        screenshotFormat="image/jpeg" // 🖼️ 캡처 포맷 지정
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: "user", // 📷 전면 카메라 사용
        }}
        style={{ width: "100%", maxWidth: "600px" }}
      />
      <div>
        {recording ? (
          <button onClick={stopRecording}>⏹ 녹화 중지</button>
        ) : (
          <button onClick={startRecording}>🔴 녹화 시작</button>
        )}
      </div>
      {videoBlob && (
        <div>
          <h3>📁 녹화된 영상</h3>
          <video src={URL.createObjectURL(videoBlob)} controls width="640" />
          <a
            href={URL.createObjectURL(videoBlob)}
            download="recorded-video.webm"
          >
            📥 다운로드
          </a>
        </div>
      )}
    </div>
  );
};

export default PackageWebcam;
