import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  uploadVideo,
  sendSMS,
  testConnection,
  testConnection1,
  testConnection2,
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

  //blob으로 보내기
  // const startBackgroundRecording = () => {
  //   if (!webcamRef.current || !webcamRef.current.stream) {
  //     console.error("웹캠 스트림이 준비되지 않았습니다.");
  //     return;
  //   }

  //   const stream = webcamRef.current.stream;
  //   backgroundRecorderRef.current = new MediaRecorder(stream);
  //   let tempChunks = [];

  //   backgroundRecorderRef.current.ondataavailable = async (event) => {
  //     const chunk = event.data;
  //     await testConnection(chunk);

  //     tempChunks.push(event.data);
  //     if (tempChunks.length > 60) {
  //       tempChunks.shift();
  //     }
  //     const combinedBlob = new Blob(tempChunks, { type: "video/webm" });
  //     setPrevVideoBlob([combinedBlob]);
  //   };

  //   backgroundRecorderRef.current.start(1000);
  //   setBackGroundRecording(true);
  //   console.log("이전 녹화 시작");
  // };

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

  //캡쳐해서 보내기

  const startBackgroundRecording = () => {
    if (!webcamRef.current || !webcamRef.current.stream) {
      console.error("웹캠 스트림이 준비되지 않았습니다.");
      return;
    }

    const stream = webcamRef.current.stream;
    // MediaRecorder 생성
    const mediaRecorder = new MediaRecorder(stream);
    backgroundRecorderRef.current = { mediaRecorder, captureIntervalId: null };

    let tempChunks = [];

    mediaRecorder.ondataavailable = async (event) => {
      const chunk = event.data;

      tempChunks.push(chunk);
      if (tempChunks.length > 60) {
        tempChunks.shift();
      }
      const combinedBlob = new Blob(tempChunks, { type: "video/webm" });
      setPrevVideoBlob([combinedBlob]);
    };

    mediaRecorder.start(1000);
    setBackGroundRecording(true);
    console.log("이전 녹화 시작");

    // 프레임 캡쳐 및 서버 전송
    const captureIntervalId = setInterval(async () => {
      if (!webcamRef.current || !webcamRef.current.video) return;

      const video = webcamRef.current.video;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataURL = canvas.toDataURL("image/jpeg", 0.95);

      try {
        const gesture = await testConnection2(dataURL); // base64 데이터 URL 전송

        if (gesture === "Lv1" || gesture === "Lv2" || gesture === "Lv3") {
          setLevel(gesture);
          console.log("Detected gesture level:", gesture);

          // 레벨 감지되면 녹화 중지 함수 호출
          stopBackgroundRecording();
        } else {
          console.log("Invalid gesture level:", gesture);
        }
      } catch (error) {
        console.error("프레임 서버 전송 실패:", error);
      }
    }, 500);

    backgroundRecorderRef.current.captureIntervalId = captureIntervalId;
  };

  // 녹화 중지 함수
  const stopBackgroundRecording = () => {
    if (backgroundRecorderRef.current) {
      // MediaRecorder가 있으면 중지
      if (backgroundRecorderRef.current.mediaRecorder) {
        backgroundRecorderRef.current.mediaRecorder.stop();
      }
      // 캡쳐 인터벌도 제거
      if (backgroundRecorderRef.current.captureIntervalId) {
        clearInterval(backgroundRecorderRef.current.captureIntervalId);
      }

      setBackGroundRecording(false);
      console.log(prevVideoBlob[0]);
      console.log("이전 녹화 중지");
    }
  };

  //레벨을 감지하면 이전 녹화가 종료되고 현재 발생한 상황 녹화
  //위치 정보 포함 x
  // const startRecording = async () => {
  //   console.log(level);
  //   if (level === "Lv1") {
  //     // warningSound.play();
  //   }
  //   const phoneNum = localStorage.getItem(level); // 📱 번호 불러오기
  //   // const phoneNum = "+821099737467"; // 📱 번호 불러오기
  //   console.log(phoneNum);
  //   if (!phoneNum) {
  //     alert("휴대폰 번호가 저장되어 있지 않습니다!");
  //     return;
  //   }
  //   await sendSMS(phoneNum, level);

  //   setRecording(true);
  //   const stream = webcamRef.current.stream;
  //   mediaRecorderRef.current = new MediaRecorder(stream);
  //   const chunks = [];

  //   mediaRecorderRef.current.ondataavailable = (event) => {
  //     chunks.push(event.data);
  //   };
  //   mediaRecorderRef.current.onstop = async () => {
  //     const videoBlob = new Blob(chunks, { type: "video/webm" });

  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         const { latitude, longitude } = position.coords;
  //         console.log(level);
  //         await uploadVideo(prevVideoBlob[0], videoBlob, latitude, longitude);
  //         // await sendSMS(latitude, longitude, phoneNum, level);
  //       },
  //       (error) => {
  //         console.error(error);
  //       }
  //     );
  //   };
  //   mediaRecorderRef.current.start();
  // };

  //위치 정보 포함
  const startRecording = async () => {
    console.log(level);
    if (level === "Lv1") {
      // warningSound.play();
    }
    const phoneNum = localStorage.getItem(level); // 📱 번호 불러오기
    // const phoneNum = "+821099737467"; // 📱 번호 불러오기
    console.log(phoneNum);
    if (!phoneNum) {
      alert("휴대폰 번호가 저장되어 있지 않습니다!");
      return;
    }

    // 위치 정보를 먼저 받아서 문자 전송
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await sendSMS(phoneNum, level, latitude, longitude);

        setRecording(true);
        const stream = webcamRef.current.stream;
        mediaRecorderRef.current = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          chunks.push(event.data);
        };
        mediaRecorderRef.current.onstop = async () => {
          const videoBlob = new Blob(chunks, { type: "video/webm" });
          // 위치 정보 얻는 부분 삭제하고 uploadVideo만 실행
          await uploadVideo(prevVideoBlob[0], videoBlob, latitude, longitude);
        };
        mediaRecorderRef.current.start();
      },
      (error) => {
        console.error(error);
        alert("위치 정보를 가져올 수 없습니다.");
      }
    );
  };

  const stopRecording = async () => {
    setRecording(false);
    mediaRecorderRef.current.stop(); //녹화 중지, onstop 이벤트 실행
  };
  // console.log(level);
  return (
    <div className="package-webcam-container">
      <div className="button">
        <button onClick={() => setLevel("Lv1")}>Level 1</button>
        <button onClick={() => setLevel("Lv2")}>Level 2</button>
        <button onClick={() => setLevel("Lv3")}>Level 3</button>

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
