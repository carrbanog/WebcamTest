import axios from "axios";

const BASE_URL = " https://13db-220-89-15-23.ngrok-free.app"; // ngrok URL로 변경
const BASE_URL1 = "http://localhost:5000";

export const uploadVideo = async (
  prevVideoBlob,
  videoBlob,
  latitude,
  longitude
) => {
  const formData = new FormData();
  let videoNumber = localStorage.getItem("videoNumber") || 0;
  videoNumber = parseInt(videoNumber, 10) + 1; // videoNumber 증가

  const prevFileName = `prevVideo${videoNumber}.webm`;
  const fileName = `video${videoNumber}.webm`;
  formData.append("prevVideo", prevVideoBlob, prevFileName);
  formData.append("video", videoBlob, fileName);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);

  try {
    const response = await axios.post(`${BASE_URL1}/upload`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
    alert(response.data.message);

    // videoNumber를 로컬 스토리지에 저장
    localStorage.setItem("videoNumber", videoNumber); // videoNumber 값 저장
  } catch (err) {
    console.error(err);
  }
};
// const phoneNum = process.env.REACT_APP_PHONE_NUMBER;
// export const sendSMS = async (phoneNum, level) => {
//   try {
//     // let internationalPhone = phoneNum;
//     // if (phoneNum.startsWith("0")) {
//     //   internationalPhone = "+82" + phoneNum.slice(1);
//     // }
//     const response = await axios.post(`${BASE_URL1}/send-sms`, {
//       to: phoneNum,
//       message: `${level}상황 발생! 지금 즉시 구조가 필요합니다.`,
//     });
//     console.log("📩 문자 전송 성공:", response.data);
//   } catch (error) {
//     console.error("🚨 문자 전송 실패:", error);
//   }
// };

export const sendSMS = async (
  phoneNum,
  level,
  latitude,
  longitude,
  content
) => {
  try {
    const response = await axios.post(`${BASE_URL1}/send-sms`, {
      to: phoneNum,
      message: `${content}\n위치: https://maps.google.com/?q=${latitude},${longitude}`,
    });
    console.log("📩 문자 전송 성공:", response.data);
  } catch (error) {
    console.error("🚨 문자 전송 실패:", error);
  }
};

export const callSavedVideo = async () => {
  try {
    const response = await axios.get(`${BASE_URL1}/videos`);
    console.log("get", response.data);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const testConnection = async (blob) => {
  const formData = new FormData();
  formData.append("video_chunk", blob);

  try {
    const res = await fetch("http://10.2.13.128:3000/recognize-gesture", {
      method: "POST",
      body: formData,
    });
    console.log(res);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error("영상 청크 전송 실패:", err);
  }
};

export const testConnection1 = async (blob) => {
  try {
    // 1. 비디오 요소 생성
    const video = document.createElement("video");
    video.src = URL.createObjectURL(blob);
    video.muted = true;
    video.playsInline = true;

    // 2. 비디오 로드 대기
    await new Promise((resolve, reject) => {
      video.oncanplay = () => resolve();
      video.onerror = () => reject(new Error("비디오 로드 실패"));
    });

    // 3. 캔버스를 사용하여 프레임 추출
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frameBlob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.95)
    );

    // 메모리 정리
    URL.revokeObjectURL(video.src);

    if (!frameBlob) {
      throw new Error("프레임 변환 실패");
    }

    // 4. 프레임을 서버로 전송
    const formData = new FormData();
    formData.append("frame", frameBlob, "frame.jpg");

    const res = await fetch("http://10.2.13.236:3000/recognize-gesture", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`서버 오류: ${res.status}`);
    }

    const data = await res.json();
    console.log("서버 응답:", data);
    return data;
  } catch (err) {
    console.error("프레임 전송 실패:", err);
  }
};

export const testConnection2 = async (dataURL) => {
  try {
    const res = await fetch("http://10.2.13.128:5000/process_gesture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // JSON으로 보낼 때 꼭 설정
      },
      body: JSON.stringify({ image: dataURL }), // { image: "data:image/jpeg;base64,..." } 이런 형태로 보냄
    });
    // console.log(dataURL);

    if (!res.ok) {
      throw new Error(`서버 에러: ${res.status}`);
    }
    // console.log(res.gesture);
    const data = await res.json();
    console.log(data);
    console.log("서버 응답:", data.gesture);
    return data.gesture;
  } catch (err) {
    console.error("이미지 전송 실패:", err);
  }
};

export const extractFramesFromBlob = async (blob, onFrame) => {
  return new Promise((resolve, reject) => {
    console.log(blob);
    const url = URL.createObjectURL(blob);
    const video = document.createElement("video");
    console.log(video);
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.remove();
    };

    let handled = false; // 중복 호출 방지용

    video.addEventListener("loadedmetadata", () => {
      // 현재 동영상 길이가 0일 수도 있어서 안전하게 최소값 지정
      if (video.duration === 0 || isNaN(video.duration)) {
        cleanup();
        reject(new Error("비디오 길이가 0이거나 유효하지 않습니다."));
        return;
      }
      video.currentTime = 0;
    });

    video.addEventListener("seeked", () => {
      if (handled) return; // 한 번만 처리
      handled = true;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (frameBlob) => {
          if (frameBlob) {
            onFrame(frameBlob);
            cleanup();
            resolve();
          } else {
            cleanup();
            reject(new Error("프레임 Blob 생성 실패"));
          }
        },
        "image/jpeg",
        0.95
      );
    });

    video.addEventListener("error", (e) => {
      cleanup();
      reject(new Error("비디오 로드 실패 또는 재생 불가: " + e.message));
    });

    // 안전을 위해 타임아웃 추가 (예: 5초)
    setTimeout(() => {
      if (!handled) {
        cleanup();
        reject(new Error("프레임 추출 타임아웃"));
      }
    }, 5000);
  });
};
