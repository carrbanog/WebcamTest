import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  uploadVideo,
  sendSMS,
  testConnection,
  extractFramesFromBlob,
} from "../api/api";
import warningSound from "../../public/warning-sound.wav";
import "./PackageWebcam.css";
import InputNum from "./InputNum";
import { io } from "socket.io-client"; // 상단 import 추가
import { sendFrameToServer } from "../api/api1";

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

  useEffect(() => {
    if (level) {
      if (backGroundRecording) {
        stopBackgroundRecording();
      }
      startRecording();
    }
  }, [level]);

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

  // const socket = io("http://10.1.7.161:8000", {
  //   transports: ["websocket"],
  // });

  //웹 페이지에 접속하고 버튼을 누르면 계속 녹화를 실행 blob로 보냄냄
  const startBackgroundRecording = () => {
    if (!webcamRef.current || !webcamRef.current.stream) {
      console.error("웹캠 스트림이 준비되지 않았습니다.");
      return;
    }

    const stream = webcamRef.current.stream;
    backgroundRecorderRef.current = new MediaRecorder(stream);
    let tempChunks = [];

    backgroundRecorderRef.current.ondataavailable = async (event) => {
      const chunk = event.data;
      await testConnection(chunk);

      tempChunks.push(event.data);
      if (tempChunks.length > 60) {
        tempChunks.shift();
      }
      const combinedBlob = new Blob(tempChunks, { type: "video/webm" });
      setPrevVideoBlob([combinedBlob]);
    };

    backgroundRecorderRef.current.start(1000);
    setBackGroundRecording(true);
    console.log("이전 녹화 시작");
  };

  // frame으로 보내는 코드
  // const startBackgroundRecording = () => {
  //   if (!webcamRef.current || !webcamRef.current.stream) {
  //     console.error("웹캠 스트림이 준비되지 않았습니다.");
  //     return;
  //   }

  //   const stream = webcamRef.current.stream;
  //   backgroundRecorderRef.current = new MediaRecorder(stream);
  //   let tempChunks = [];

  //   const convertChunkToFrame = async (chunk) => {
  //     try {
  //       const video = document.createElement("video");
  //       video.src = URL.createObjectURL(chunk);
  //       video.muted = true;
  //       video.playsInline = true;

  //       await new Promise((resolve, reject) => {
  //         video.oncanplay = () => resolve();
  //         video.onerror = () => reject(new Error("비디오 로드 실패"));
  //       });

  //       const canvas = document.createElement("canvas");
  //       canvas.width = video.videoWidth;
  //       canvas.height = video.videoHeight;

  //       const ctx = canvas.getContext("2d");
  //       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  //       const frameBlob = await new Promise((resolve) =>
  //         canvas.toBlob(resolve, "image/jpeg", 0.95)
  //       );

  //       URL.revokeObjectURL(video.src);
  //       return frameBlob;
  //     } catch (error) {
  //       console.error("프레임 변환 실패:", error);
  //       return null;
  //     }
  //   };

  //   backgroundRecorderRef.current.ondataavailable = async (event) => {
  //     const chunk = event.data;

  //     // 프레임으로 변환 후 서버로 전송
  //     const frameBlob = await convertChunkToFrame(chunk);
  //     if (frameBlob) {
  //       try {
  //         await testConnection(frameBlob); // 서버로 프레임 전송
  //       } catch (err) {
  //         console.error("프레임 서버 전송 실패:", err);
  //       }
  //     }

  //     // 이전 영상 저장용
  //     tempChunks.push(event.data);
  //     if (tempChunks.length > 60) {
  //       tempChunks.shift();
  //     }
  //     const combinedBlob = new Blob(tempChunks, { type: "video/webm" });
  //     setPrevVideoBlob([combinedBlob]);
  //   };

  //   backgroundRecorderRef.current.start(1000); // 1초마다 청크 생성
  //   setBackGroundRecording(true);
  //   console.log("이전 녹화 시작");
  // };

  const stopBackgroundRecording = () => {
    if (backgroundRecorderRef.current) {
      backgroundRecorderRef.current.stop();
      setBackGroundRecording(false);
      console.log(prevVideoBlob[0]);
      console.log("이전 녹화 중지");
    }
  };

  //레벨을 감지하면 이전 녹화가 종료되고 현재 발생한 상황 녹화화
  const startRecording = async () => {
    if (level === "level1") {
      // warningSound.play();
    }
    const phoneNum = localStorage.getItem(level); // 📱 번호 불러오기
    console.log(phoneNum);
    if (!phoneNum) {
      alert("휴대폰 번호가 저장되어 있지 않습니다!");
      return;
    }
    // await sendSMS(phoneNum, level);

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
          console.log(level);
          await uploadVideo(prevVideoBlob[0], videoBlob, latitude, longitude);
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
  // console.log(level);
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
      <div className="getLevel">{level}</div>
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
