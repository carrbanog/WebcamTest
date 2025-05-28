import React, { useState, useEffect } from "react";
import "./InputNum.css";

const InputNum = () => {
  const levels = ["Lv1", "Lv2", "Lv3"];
  const [phoneNum, setPhoneNum] = useState({
    Lv1: "",
    Lv2: "",
    Lv3: "",
  });
  const [content, setContent] = useState({
    Lv1: "",
    Lv2: "",
    Lv3: "",
  });
  const [savedPhoneNum, setSavedPhoneNum] = useState({
    Lv1: "",
    Lv2: "",
    Lv3: "",
  });
  const [savedContent, setSavedContent] = useState({
    Lv1: "",
    Lv2: "",
    Lv3: "",
  });

  useEffect(() => {
    const storedNums = {};
    const storedContents = {};
    levels.forEach((level) => {
      const num = localStorage.getItem(level);
      const content = localStorage.getItem(`${level}-content`);
      if (num) {
        storedNums[level] = num;
      }
      if (content) {
        storedContents[level] = content;
      }
    });
    setSavedPhoneNum((prev) => ({ ...prev, ...storedNums }));
    setSavedContent((prev) => ({ ...prev, ...storedContents }));
  }, []);

  const handleChange = (e, level) => {
    setPhoneNum((prev) => ({ ...prev, [level]: e.target.value }));
  };

  const handleContentChange = (e, level) => {
    setContent((prev) => ({ ...prev, [level]: e.target.value }));
  };

  const handleSubmit = (e, level) => {
    e.preventDefault();
    const trimmed = phoneNum[level].trim();
    const trimmedContent = content[level].trim();
    if (!trimmed && !trimmedContent) return;

    if (trimmed) {
      localStorage.setItem(level, trimmed);
      setSavedPhoneNum((prev) => ({ ...prev, [level]: trimmed }));
      setPhoneNum((prev) => ({ ...prev, [level]: "" }));
    }

    if (trimmedContent) {
      localStorage.setItem(`${level}-content`, trimmedContent);
      setSavedContent((prev) => ({ ...prev, [level]: trimmedContent }));
      setContent((prev) => ({ ...prev, [level]: "" }));
    }
  };

  return (
    <div className="input-num-container">
      <div className="level-forms">
        {levels.map((level) => (
          <div key={level} className="level-form">
            <h3>{level.toUpperCase()}</h3>
            <form
              onSubmit={(e) => handleSubmit(e, level)}
              className="input-num-form"
            >
              <input
                type="tel"
                id={`phoneInput-${level}`}
                value={phoneNum[level]}
                placeholder="821012345678"
                onChange={(e) => handleChange(e, level)}
                className="input-num-input"
              />
              <input
                type="text"
                value={content[level]}
                placeholder="내용을 입력하세요"
                onChange={(e) => handleContentChange(e, level)}
                className="input-num-input"
              />
              <button type="submit" className="input-num-button">
                저장
              </button>
              <div className="level-description">
                {level === "Lv1" &&
                  "level1 상황이 발생하면 즉시 119와 지정돤 번호로 신고가 가고 사이렌이 울립니다"}
                {level === "Lv2" &&
                  "level2 상황이 발생하면 즉시 112와 지정된 번허로 신고가 가고 경고 메세지가 재생됩니다."}
                {level === "Lv3" &&
                  "level3 상황이 발생하면 지정된 번허로 문자를 보냅니다."}
              </div>
            </form>
            <div className="saved-info">
              {savedPhoneNum[level] && (
                <div className="saved-number">
                  저장된 번호: {savedPhoneNum[level]}
                </div>
              )}
              {savedContent[level] && (
                <div className="saved-content">
                  저장된 내용: {savedContent[level]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputNum;
