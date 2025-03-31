import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Link } from "react-router-dom";
import { uploadVideo, sendSMS } from "../api/api";
import warningSound from "../../public/warning-sound.wav";
import "./PackageWebcam.css";

const PackageWebcam = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const backgroundRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [backGroundRecording, setBackGroundRecording] = useState(false);
  const [videoBlobs, setVideoBlobs] = useState([]);
  const [prevVideoBlob, setPrevVideoBlob] = useState([]);
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
      if (tempChunks.length > 40) {
        tempChunks = tempChunks.slice(40);
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
    // warningSound.play();
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
          console.log(prevVideoBlob[0]);
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
    <div className="package-webcam-container">
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
      <Link to="/savevideo" className="save-video-link">
        저장된 영상 보기
      </Link>
    </div>
  );
};

export default PackageWebcam;
