import React, { useRef, useState, useEffect } from "react";
import "./InputNum.css";

const InputNum = () => {
  const [phoneNum, setPhoneNum] = useState("");
  const [savedPhoneNum, setSavedPhoneNum] = useState("");

  useEffect(() => {
    const storedNumber = localStorage.getItem("phoneNum");
    if (storedNumber) {
      setSavedPhoneNum(storedNumber);
    }
  }, []);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phoneNum.trim()) {
      return;
    }

    localStorage.setItem("phoneNum", phoneNum);
    setSavedPhoneNum(phoneNum);
    setPhoneNum("");
  };

  return (
    <div className="input-num-container">
      <form onSubmit={handlePhoneSubmit} className="input-num-form">
        <input
          type="tel"
          id="phoneInput"
          value={phoneNum}
          placeholder="821012345678"
          onChange={(e) => setPhoneNum(e.target.value)}
          className="input-num-input"
        />
        <button type="submit" className="input-num-button">
          저장
        </button>
      </form>
      {savedPhoneNum && (
        <div className="saved-number">저장된 번호: {savedPhoneNum}</div>
      )}
    </div>
  );
};

export default InputNum;
