import axios from "axios";

export const uploadVideo = async (videoBlob) => {
  const formData = new FormData();
  formData.append("video", videoBlob, "recorded-video.webm");

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
export const sendSMS = async () => {
  try {
    const response = await axios.post("http://localhost:5000/send-sms", {
      to: "d",
      message: "영상을 보내기 위한 테스트 입니다",
    });
    console.log("📩 문자 전송 성공:", response.data);
  } catch (error) {
    console.error("🚨 문자 전송 실패:", error);
  }
};

// export default { uploadVideo, sendSMS };
