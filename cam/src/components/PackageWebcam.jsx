import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

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

      const formData = new FormData();
      formData.append("video", videoBlob, "recorded-video-webm");

      try {
        const response = await axios.post(
          "http://localhost:5000/upload",
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);
      } catch (err) {
        console.error(err);
      }
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
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
      {videoBlobs.length > 0 && (
        <div>
          <h3>저장된 영상 목록</h3>
          {videoBlobs.map((blob, index) => {
            return (
              <div key={index}>
                <h4>영상 {index + 1}</h4>
                <video src={URL.createObjectURL(blob)} controls width="640" />
                <a
                  href={URL.createObjectURL(blob)}
                  download={`video-${index + 1}.webm`}
                >
                  다운로드
                </a>
              </div>
            );
          })}
        </div>
      )}
      <button
        onClick={() =>
          navigator.clipboard.writeText(URL.createObjectURL(videoBlobs[0]))
        }
      >
        🎥 영상 링크 복사
      </button>
    </div>
  );
};

export default PackageWebcam;
