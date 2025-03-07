import React, { useRef } from "react";
import TestWebcam from "react-webcam";

const Webcam = () => {
  const webcamRef = useRef(null);
  console.log(webcamRef.current);
  return (
    <div>
      <h2>웹캠</h2>
      <TestWebcam
        ref={webcamRef}
        audio={false}
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: "user",
        }}
        style={{ width: "100%", maxWidth: "600px" }}
      />
    </div>
  );
};

export default Webcam;
