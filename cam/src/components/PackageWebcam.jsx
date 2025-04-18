import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Link } from "react-router-dom";
import { uploadVideo, sendSMS, testConnection } from "../api/api";
import warningSound from "../../public/warning-sound.wav";
import "./PackageWebcam.css";
import InputNum from "./InputNum";

const PackageWebcam = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const backgroundRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [backGroundRecording, setBackGroundRecording] = useState(false);
  const [videoBlobs, setVideoBlobs] = useState([]);
  const [prevVideoBlob, setPrevVideoBlob] = useState([]);
  const [level, setLevel] = useState("");
  const warningSound = new Audio("/warning-sound.wav");

  // useEffect(() => {
  //   const initializeWebcam = async () => {
  //     try {
  //       // 웹캠 스트림이 준비될 때까지 대기
  //       await new Promise((resolve) => {
  //         const checkStream = () => {
  //           if (webcamRef.current && webcamRef.current.stream) {
  //             resolve();
  //           } else {
  //             setTimeout(checkStream, 100);
  //           }
  //         };
  //         checkStream();
  //       });

  //       // 스트림이 준비되면 녹화 시작
  //       startBackgroundRecording();
  //     } catch (error) {
  //       console.error("웹캠 초기화 중 오류 발생:", error);
  //     }
  //   };

  //   initializeWebcam();
  // }, []);

  // console.log(webcamRef.current);
  // console.log(mediaRecorderRef.current);
  // console.log(videoBlob);

  const startBackgroundRecording = () => {
    if (!webcamRef.current || !webcamRef.current.stream) {
      console.error("웹캠 스트림이 준비되지 않았습니다.");
      return;
    }

    const stream = webcamRef.current.stream;
    backgroundRecorderRef.current = new MediaRecorder(stream);
    let tempChunks = [];

    backgroundRecorderRef.current.ondataavailable = (event) => {
      tempChunks.push(event.data);
      if (tempChunks.length > 15) {
        tempChunks.shift();
      }
      const combinedBlob = new Blob(tempChunks, { type: "video/webm" });
      setPrevVideoBlob([combinedBlob]);
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
    if (level === "level1") {
      // warningSound.play();
    }
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
          const phoneNum = localStorage.getItem(level); // 📱 번호 불러오기
          console.log(phoneNum);
          if (!phoneNum) {
            alert("휴대폰 번호가 저장되어 있지 않습니다!");
            return;
          }
          console.log(phoneNum);
          // await testConnection();
          // await uploadVideo(prevVideoBlob[0], videoBlob, latitude, longitude);
          // await sendSMS(latitude, longitude, phoneNum, level);
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
    <div className="package-webcam-container">
      <div className="button">
        <button onClick={() => setLevel("level1")}>Level 1</button>
        <button onClick={() => setLevel("level2")}>Level 2</button>
        <button onClick={() => setLevel("level3")}>Level 3</button>

        <p>선택된 레벨: {level}</p>
      </div>
      <button className="record-button" onClick={startBackgroundRecording}>
        이전 녹화 시작
      </button>
      {/* <h2 className="package-webcam-title">📷 노트북 웹캠</h2> */}
      <div className="webcam-wrapper">
        <div className="webcam-container">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: "user",
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div>
      <div className="button-container">
        {recording ? (
          <button className="record-button recording" onClick={stopRecording}>
            ⏹ 현재 녹화 중지
          </button>
        ) : (
          <button
            className="record-button"
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
    </div>
  );
};

export default PackageWebcam;
