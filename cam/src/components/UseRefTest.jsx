import React, { useEffect, useRef, useState } from "react";

const UseRefTest = () => {
  const [count, setCount] = useState(0);
  const [refCount, setRefCount] = useState(0);
  const [refPrevCount, setRefPrevCount] = useState(0);
  const prevCountRef = useRef(null);
  console.log(prevCountRef);

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  useEffect(() => {
    if (refCount !== null) {
      setRefPrevCount(count); // 이전 count 값을 설정
    }
  }, [refCount]);
  return (
    <div>
      <div className="ref">
        <h1>ref 사용</h1>
        <h2>현재 값: {count}</h2>
        <h2>이전 값: {prevCountRef.current}</h2>
        <button onClick={() => setCount(count + 1)}>1 증가</button>
      </div>
      <div className="state">
        <h1>state 사용</h1>
        <h2>현재 값: {refCount}</h2>
        <h2>이전 값: {refPrevCount}</h2>
        <button onClick={() => setRefCount(count + 1)}>1 증가</button>
      </div>
    </div>
  );
};

export default UseRefTest;
