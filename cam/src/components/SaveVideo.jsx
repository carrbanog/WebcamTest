import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SaveVideo = () => {
  const [savedVideo, setSavedVideo] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/videos");
        console.log(response);
        setSavedVideo(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVideos();
  }, []);
  return (
    <div>
      <h2>저장된 영상 목록</h2>
      {savedVideo.length === 0 ? (
        <p>저장된 영상이 없습니다.</p>
      ) : (
        <ul>
          {savedVideo.map((video) => (
            <li key={video._id}>
              <h3>{video.filename}</h3>
              <video controls width="640">
                <source
                  src={`http://localhost:5000/videos/${video._id}`}
                  type={video.mimeType}
                />
              </video>
            </li>
          ))}
        </ul>
      )}
      <Link to="/">돌아가기</Link>
    </div>
  );
};

export default SaveVideo;
