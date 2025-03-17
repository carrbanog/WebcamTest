import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Link } from "react-router-dom";
import { uploadVideo, sendSMS } from "../api/api";

const PackageWebcam = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [videoBlobs, setVideoBlobs] = useState([]);

  // console.log(webcamRef.current);
  // console.log(mediaRecorderRef.current);
  // console.log(videoBlob);

  const startRecording = () => {
    setRecording(true);
    const stream = webcamRef.current.stream;
    console.log(stream);
    mediaRecorderRef.current = new MediaRecorder(stream);
    console.log(mediaRecorderRef.current);
    const chunks = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      chunks.push(event.data);
      console.log(chunks);
      console.log(event);
    };
    mediaRecorderRef.current.onstop = async () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      setVideoBlobs((prevBlobs) => [...prevBlobs, videoBlob]);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`위도: ${latitude}, 경도: ${longitude}`);

          await uploadVideo(videoBlob, latitude, longitude);
          // await sendSMS(latitude, longitude);
        },
        (error) => {
          console.error(error);
        }
      );
    };
    mediaRecorderRef.current.start();
  };
  const stopRecording = async () => {
    setRecording(false);
    mediaRecorderRef.current.stop(); //녹화 중지, onstop 이벤트 실행
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
      <Link to="/savevideo">저장된 영상 보기</Link>
    </div>
  );
};

export default PackageWebcam;
