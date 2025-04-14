import React, { useState, useEffect } from "react";
import "./InputNum.css";

const InputNum = () => {
  const levels = ["level1", "level2", "level3"];
  const [phoneNum, setPhoneNum] = useState({
    level1: "",
    level2: "",
    level3: "",
  });
  const [savedPhoneNum, setSavedPhoneNum] = useState({
    level1: "",
    level2: "",
    level3: "",
  });

  useEffect(() => {
    const storedNums = {};
    levels.forEach((level) => {
      const num = localStorage.getItem(level);
      if (num) {
        storedNums[level] = num;
      }
    });
    setSavedPhoneNum((prev) => ({ ...prev, ...storedNums }));
  }, []);

  const handleChange = (e, level) => {
    setPhoneNum((prev) => ({ ...prev, [level]: e.target.value }));
  };

  const handleSubmit = (e, level) => {
    e.preventDefault();
    const trimmed = phoneNum[level].trim();
    if (!trimmed) return;

    localStorage.setItem(level, trimmed);
    setSavedPhoneNum((prev) => ({ ...prev, [level]: trimmed }));
    setPhoneNum((prev) => ({ ...prev, [level]: "" }));
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
              <button type="submit" className="input-num-button">
                저장
              </button>
            </form>
            {savedPhoneNum[level] && (
              <div className="saved-number">
                저장된 번호: {savedPhoneNum[level]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputNum;
