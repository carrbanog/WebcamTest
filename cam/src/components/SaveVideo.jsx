import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./SaveVideo.css";

const SaveVideo = () => {
  const [savedVideo, setSavedVideo] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/videos");
        console.log("get", response.data);
        setSavedVideo(response.data);
        // response.data.map((e) => console.log(e.fileName));
        // const response2 = await axios.get(
        //   `http://localhost:5000/videos/${response.data[0].prevFileName}`
        // );
        // console.log(response2);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVideos();
  }, []);

  savedVideo.map((e) => console.log("파일 이름", e.fileName));
  // console.log(savedVideo);
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
            <div key={video._id} className="video-item">
              <div className="video-pair">
                <div className="video-container">
                  <h3 className="video-title">이전 영상</h3>
                  <h4 className="video-info">{`위도: ${video.latitude}, 경도: ${video.longitude}`}</h4>
                  <video controls className="video-player">
                    <source
                      src={`http://localhost:5000/videos/${video.prevFileName}`}
                      type="video/webm"
                    />
                  </video>
                </div>
                <div className="video-container">
                  <h3 className="video-title">현재 영상</h3>
                  <h4 className="video-info">{`위도: ${video.latitude}, 경도: ${video.longitude}`}</h4>
                  <video controls className="video-player">
                    <source
                      src={`http://localhost:5000/videos/${video.fileName}`}
                      type={video.mimeType}
                    />
                  </video>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SaveVideo;
