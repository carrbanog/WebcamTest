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
export const sendSMS = async (latitude, longitude, phoneNum, level) => {
  try {
    // let internationalPhone = phoneNum;
    // if (phoneNum.startsWith("0")) {
    //   internationalPhone = "+82" + phoneNum.slice(1);
    // }
    const response = await axios.post(`${BASE_URL1}/send-sms`, {
      to: phoneNum,
      message: `${level}상황 발생! 현재 위치: https://www.google.com/maps?q=${latitude},${longitude}`,
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

export async function testConnection(blob) {
  const formData = new FormData();
  formData.append("video_chunk", blob);

  try {
    const res = await fetch("http://10.1.6.242:5000/test", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("영상 청크 전송 실패:", err);
  }
}

// export async function testConnection() {
//   const formData = new FormData();
//   formData.append("message", "Hello from frontend"); // 테스트용 문자열 추가

//   try {
//     const response = await fetch("http://10.1.6.242:5000/test", {
//       method: "POST",
//       body: formData,
//     });

//     const data = await response.json();
//     return data;
//   } catch (err) {
//     console.error("문자 전송 실패:", err);
//   }
// }
// export default { uploadVideo, sendSMS };
