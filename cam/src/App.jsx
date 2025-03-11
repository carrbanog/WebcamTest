import { useState } from "react";
import Webcam from "./components/Webcam";
import PackageWebcam from "./components/PackageWebcam";
import UseRefTest from "./components/UseRefTest";
// import "./App.css";

function App() {
  return (
    <div>
      {/* <UseRefTest /> */}
      {/* <Webcam /> */}
      <PackageWebcam />
    </div>
  );
}

export default App;
