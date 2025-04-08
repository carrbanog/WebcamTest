import React, { useMemo } from "react";
import PropTypes from "prop-types";
import "./Video.css";

const Video = ({ video, baseUrl }) => {
  // 스타일을 useMemo로 메모이제이션하여 불필요한 재계산 방지
  const videoContainerStyle = useMemo(
    () => ({
      width: "100%",
      maxWidth: "800px",
      margin: "0 auto",
    }),
    []
  );

  // 위치 정보 포맷팅
  const locationInfo = useMemo(
    () => `위도: ${video.latitude}, 경도: ${video.longitude}`,
    [video.latitude, video.longitude]
  );

  return (
    <div className="video-item">
      <div className="video-pair">
        <div className="video-container" style={videoContainerStyle}>
          <h3 className="video-title">사건 이전 영상</h3>
          <h4 className="video-info">{locationInfo}</h4>
          <video controls className="video-player" preload="metadata">
            <source
              src={`${baseUrl}/videos/${video.prevFileName}`}
              type="video/webm"
            />
            브라우저가 비디오를 지원하지 않습니다.
          </video>
        </div>
        <div className="video-container" style={videoContainerStyle}>
          <h3 className="video-title">사건 영상</h3>
          <h4 className="video-info">{locationInfo}</h4>
          <video controls className="video-player" preload="metadata">
            <source
              src={`${baseUrl}/videos/${video.fileName}`}
              type={video.mimeType}
            />
            브라우저가 비디오를 지원하지 않습니다.
          </video>
        </div>
      </div>
    </div>
  );
};

Video.propTypes = {
  video: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    prevFileName: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    mimeType: PropTypes.string.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
  baseUrl: PropTypes.string.isRequired,
};

export default React.memo(Video);
