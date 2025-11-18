'use client';

import React, { useState } from 'react';
import { FaUnlockAlt } from 'react-icons/fa';

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  videoUrl: string;
}

interface VideoLibraryProps {
  onClose: () => void;
}

export default function VideoLibrary({ onClose }: VideoLibraryProps) {
  const videos: Video[] = [
    {
      id: 1,
      title: 'Video 1',
      thumbnail: 'https://voicealchemyacademy.com/wp-content/uploads/2023/06/thumbnail1.png',
      videoUrl: 'https://voicealchemyacademy.com/wp-content/uploads/2023/06/TIkal.mp4',
    },
    {
      id: 2,
      title: 'Video 2',
      thumbnail: 'https://voicealchemyacademy.com/wp-content/uploads/2023/06/thumbnail2.png',
      videoUrl: 'https://voicealchemyacademy.com/wp-content/uploads/2023/06/StarsTL.mp4',
    },
    {
      id: 3,
      title: 'Video 3',
      thumbnail: 'https://voicealchemyacademy.com/wp-content/uploads/2023/06/thumbnail3.png',
      videoUrl: 'https://voicealchemyacademy.com/wp-content/uploads/2023/06/DockAtitlanTL.mp4',
    },
    {
      id: 4,
      title: 'Video 4',
      thumbnail: 'https://voicealchemyacademy.com/wp-content/uploads/2023/06/thumbnail4.png',
      videoUrl: 'https://voicealchemyacademy.com/wp-content/uploads/2023/06/A005_C049_09253L_001.mp4',
    },
    // Add more video objects as needed
  ];

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const handleBackClick = () => {
    setSelectedVideo(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="popup-overlay" onClick={onClose}></div>
      <div className="video-library-popup">
        <div className="popup-header">
          {selectedVideo ? (
            <div className="back-button" onClick={handleBackClick}>
              &lt; Back
            </div>
          ) : (
            <></>
          )}
          <div className="close-icon" onClick={onClose}>
            X
          </div>
        </div>
        {selectedVideo ? (
          <div className="video-player">
            <video
              src={selectedVideo.videoUrl}
              controls
              autoPlay
              onEnded={handleCloseVideo}
              onPause={handleCloseVideo}
              className="video-element"
            />
            <p className="video-name">{selectedVideo.title}</p>
            <a className="go-to-video" href="/courses">Go to video notes and quiz</a>
          </div>
        ) : (
          <div className="video-list">
            <div className="title-bar">
              <h2>Video Library</h2>
            </div>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search videos"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="video-grid">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="video-item"
                  onClick={() => handleVideoClick(video)}
                >
                  <img
                    className="thumbnail-image"
                    src={video.thumbnail}
                    alt={video.title}
                  />
                  <div className="video-details">
                    <FaUnlockAlt /> {/* Unlock icon */}
                    <p>{video.title}</p> {/* Video title */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
