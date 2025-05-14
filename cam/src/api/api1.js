// src/api.js

const SERVER_URL = "http://192.168.216.246:8000/frame"; // 서버 엔드포인트

export async function sendFrameToServer(imageDataUrl) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageDataUrl }),
    });

    if (!response.ok) throw new Error("서버 응답 오류");

    const data = await response.json();
    return data.level; // 서버에서 level 값 반환
  } catch (error) {
    console.error("서버 요청 실패:", error);
    return null;
  }
}
