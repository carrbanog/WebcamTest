import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Link } from "react-router-dom";
import { uploadVideo, sendSMS } from "../api/api";

const PackageWebcam = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const backgroundRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [backGroundRecording, setBackGroundRecording] = useState(false);
  const [videoBlobs, setVideoBlobs] = useState([]);
  const [prevVideoBlob, setPrevVideoBlob] = useState([]);

  // console.log(webcamRef.current);
  // console.log(mediaRecorderRef.current);
  // console.log(videoBlob);

  const startBackgroundRecording = () => {
    const stream = webcamRef.current.stream;
    backgroundRecorderRef.current = new MediaRecorder(stream);
    let tempChunks = [];

    backgroundRecorderRef.current.ondataavailable = (event) => {
      tempChunks.push(event.data);
      if (tempChunks.length > 15) {
        tempChunks.shift();
      }
      const combinedBlob = new Blob(tempChunks, { type: "video/webm" });
      setPrevVideoBlob([combinedBlob]); // 하나로 합친 Blob을 상태로 설정

      console.log(tempChunks);
    };
    backgroundRecorderRef.current.start(1000);
    setBackGroundRecording(true);
    console.log("이전 녹화 시작");
  };

  const stopBackgroundRecording = () => {
    if (backgroundRecorderRef.current) {
      backgroundRecorderRef.current.stop();
      setBackGroundRecording(false);
      console.log(prevVideoBlob[0]);
      console.log("이전 녹화 중지");
    }
  };

  const startRecording = () => {
    setRecording(true);
    const stream = webcamRef.current.stream;
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      chunks.push(event.data);
    };
    mediaRecorderRef.current.onstop = async () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await uploadVideo(prevVideoBlob[0], videoBlob, latitude, longitude);
          // await uploadVideo(prevVideoBlob[0], latitude, longitude);
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
      <button onClick={startBackgroundRecording}>이전 녹화 시작</button>
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
          <button onClick={stopRecording}>⏹ 현재 녹화 중지</button>
        ) : (
          <button
            onClick={() => {
              if (backGroundRecording) {
                stopBackgroundRecording();
              }
              startRecording();
            }}
          >
            🔴 현재 녹화 시작
          </button>
        )}
      </div>
      <Link to="/savevideo">저장된 영상 보기</Link>
    </div>
  );
};

export default PackageWebcam;
