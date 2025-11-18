'use client';

import React, { useState } from 'react';

export default function CourseUploadPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (videoFile) formData.append('videoFile', videoFile);
    formData.append('title', title);
    if (thumbnail) formData.append('thumbnail', thumbnail);
    formData.append('description', description);

    try {
      // Replace with your API endpoint
      // const response = await fetch('/api/courses/upload', {
      //   method: 'POST',
      //   body: formData,
      // });

      console.log('Course uploaded successfully');
    } catch (error) {
      console.error('Error uploading course:', error);
    }
  };

  return (
    <div className="courseUploadPage">
      <h1>Course Upload</h1>
      <div className="course-upload-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Video File:</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoFileChange}
              className="file-input"
            />
          </div>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Thumbnail:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="file-input"
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
            />
          </div>
          <button type="submit" className="submit-button">
            Upload Course
          </button>
        </form>
      </div>
    </div>
  );
}
