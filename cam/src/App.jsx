import Webcam from "./components/Webcam";
import PackageWebcam from "./components/PackageWebcam";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SaveVideo from "./components/SaveVideo";
import Header from "./components/Header";
import InputNum from "./components/InputNum";
// import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* <UseRefTest /> */}
        {/* <Webcam /> */}
        <Route path="/" element={<PackageWebcam />} />
        <Route path="/savevideo" element={<SaveVideo />} />
        <Route path="/inputNum" element={<InputNum />} />
      </Routes>
    </Router>
  );
}

export default App;
