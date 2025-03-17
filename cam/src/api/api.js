import axios from "axios";

export const uploadVideo = async (videoBlob, latitude, longitude) => {
  const formData = new FormData();
  formData.append("video", videoBlob, "recorded-video.webm");
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);

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
    alert(response.data.message);
  } catch (err) {
    console.error(err);
  }
};
// const phoneNum = process.env.REACT_APP_PHONE_NUMBER;
export const sendSMS = async (latitude, longitude) => {
  try {
    const response = await axios.post("http://localhost:5000/send-sms", {
      to: "d",
      message: `현재 위치: https://www.google.com/maps?q=${latitude},${longitude}`,
    });
    console.log("📩 문자 전송 성공:", response.data);
  } catch (error) {
    console.error("🚨 문자 전송 실패:", error);
  }
};

// export default { uploadVideo, sendSMS };
