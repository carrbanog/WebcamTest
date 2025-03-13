import { useState } from "react";
import Webcam from "./components/Webcam";
import PackageWebcam from "./components/PackageWebcam";
import UseRefTest from "./components/UseRefTest";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SaveVideo from "./components/SaveVideo";
// import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* <UseRefTest /> */}
        {/* <Webcam /> */}
        <Route path="/" element={<PackageWebcam />} />
        <Route path="/savevideo" element={<SaveVideo />} />
      </Routes>
    </Router>
  );
}

export default App;
