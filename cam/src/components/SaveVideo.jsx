import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import "./SaveVideo.css";
import { callSavedVideo } from "../api/api";
import Video from "./Video";

const SaveVideo = () => {
  const [savedVideo, setSavedVideo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL1 = "http://localhost:5000";
  const renderStartTime = useRef(performance.now());
  const dataFetchStartTime = useRef(0);
  const hasLoggedPerformance = useRef(false);

  const fetchVideos = useCallback(async () => {
    try {
      dataFetchStartTime.current = performance.now();
      const data = await callSavedVideo();
      const fetchTime = performance.now() - dataFetchStartTime.current;
      console.log(`데이터 로딩 시간: ${fetchTime.toFixed(2)}ms`);
      setSavedVideo(data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const performanceMetrics = useMemo(() => {
    if (savedVideo.length > 0 && !hasLoggedPerformance.current) {
      const renderTime = performance.now() - renderStartTime.current;
      hasLoggedPerformance.current = true;

      return {
        dataFetchTime: performance.now() - dataFetchStartTime.current,
        renderTime,
        totalVideos: savedVideo.length,
      };
    }
    return null;
  }, [savedVideo]);

  useEffect(() => {
    if (performanceMetrics) {
      console.log("=== 성능 측정 결과 ===");
      console.log(
        `데이터 로딩 시간: ${performanceMetrics.dataFetchTime.toFixed(2)}ms`
      );
      console.log(`렌더링 시간: ${performanceMetrics.renderTime.toFixed(2)}ms`);
      console.log(`총 비디오 수: ${performanceMetrics.totalVideos}`);
      console.log("=====================");
    }
  }, [performanceMetrics]);

  if (isLoading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="error">에러 발생: {error}</div>;
  }

  return (
    <div className="save-video-container">
      <div className="header">
        <h1 className="title">저장된 영상 목록</h1>
        <Link to="/" className="back-button">
          돌아가기
        </Link>
      </div>

      {savedVideo.length === 0 ? (
        <p className="no-videos">저장된 영상이 없습니다.</p>
      ) : (
        <div className="video-list">
          {savedVideo.map((video) => (
            <Video key={video._id} video={video} baseUrl={BASE_URL1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(SaveVideo);
