'use client';

import React, { useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number | null;
}

interface Video {
  title: string;
  description: string;
  mediaFile: File | null;
  thumbnail: File | null;
  quizType: string;
  quizQuestions: QuizQuestion[];
}

export default function CourseUpload() {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseThumbnail, setCourseThumbnail] = useState<File | null>(null);
  const [videos, setVideos] = useState<Video[]>([{
    title: '',
    description: '',
    mediaFile: null,
    thumbnail: null,
    quizType: '',
    quizQuestions: []
  }]);

  const handleVideoChange = (index: number, key: keyof Video, value: any) => {
    const updatedVideos = [...videos];
    updatedVideos[index][key] = value as never;
    setVideos(updatedVideos);
  };

  const handleMediaFileChange = (index: number, file: File | null) => {
    const updatedVideos = [...videos];
    updatedVideos[index].mediaFile = file;
    setVideos(updatedVideos);
  };

  const handleThumbnailChange = (index: number, file: File | null) => {
    const updatedVideos = [...videos];
    updatedVideos[index].thumbnail = file;
    setVideos(updatedVideos);
  };

  const handleCourseThumbnailChange = (file: File | null) => {
    setCourseThumbnail(file);
  };

  const handleQuizTypeChange = (index: number, quizType: string) => {
    const updatedVideos = [...videos];
    updatedVideos[index].quizType = quizType;
    if (quizType === 'dropdown') {
      updatedVideos[index].quizQuestions = [{ question: '', options: [''], correctAnswer: 0 }];
    } else {
      updatedVideos[index].quizQuestions = [];
    }
    setVideos(updatedVideos);
  };

  const handleAddVideo = () => {
    setVideos([...videos, {
      title: '',
      description: '',
      mediaFile: null,
      thumbnail: null,
      quizType: '',
      quizQuestions: []
    }]);
  };

  const handleAddQuestion = (index: number) => {
    const updatedVideos = [...videos];
    updatedVideos[index].quizQuestions.push({ question: '', options: ['', '', ''], correctAnswer: 0 });
    setVideos(updatedVideos);
  };

  const handleQuestionChange = (videoIndex: number, questionIndex: number, key: string, value: any, optionIndex?: number) => {
    const updatedVideos = [...videos];
    if (key === 'options' && optionIndex !== undefined) {
      updatedVideos[videoIndex].quizQuestions[questionIndex].options[optionIndex] = value;
    } else if (key === 'correctAnswer') {
      if (updatedVideos[videoIndex].quizQuestions[questionIndex].correctAnswer === optionIndex) {
        updatedVideos[videoIndex].quizQuestions[questionIndex].correctAnswer = null;
      } else {
        updatedVideos[videoIndex].quizQuestions[questionIndex].correctAnswer = optionIndex ?? null;
      }
    } else {
      (updatedVideos[videoIndex].quizQuestions[questionIndex] as any)[key] = value;
    }
    setVideos(updatedVideos);
  };

  const handleRemoveQuestion = (videoIndex: number, questionIndex: number) => {
    const updatedVideos = [...videos];
    updatedVideos[videoIndex].quizQuestions.splice(questionIndex, 1);
    setVideos(updatedVideos);
  };

  const handleAddAnswerOption = (videoIndex: number, questionIndex: number) => {
    const updatedVideos = [...videos];
    updatedVideos[videoIndex].quizQuestions[questionIndex].options.push('');
    setVideos(updatedVideos);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ courseTitle, courseDescription, courseThumbnail, videos });
  };

  return (
    <form className="course-upload-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="courseTitle">Course Title:</label>
        <input
          type="text"
          id="courseTitle"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="courseDescription">Course Description:</label>
        <textarea
          id="courseDescription"
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
          className="form-control"
          rows={3}
        />
      </div>
      <div className="form-group">
        <label htmlFor="courseThumbnail">Course Thumbnail:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleCourseThumbnailChange(e.target.files?.[0] || null)}
          className="file-input"
        />
      </div>
      <hr />
      <h2>Videos</h2>
      {videos.map((video, videoIndex) => (
        <div key={videoIndex} className="video-group">
          <div className="form-group">
            <label htmlFor={`videoTitle${videoIndex}`}>Video Title:</label>
            <input
              type="text"
              id={`videoTitle${videoIndex}`}
              value={video.title}
              onChange={(e) => handleVideoChange(videoIndex, 'title', e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor={`videoDescription${videoIndex}`}>Video Description:</label>
            <textarea
              id={`videoDescription${videoIndex}`}
              value={video.description}
              onChange={(e) => handleVideoChange(videoIndex, 'description', e.target.value)}
              className="form-control"
              rows={3}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`videoFile${videoIndex}`}>Upload Video:</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleMediaFileChange(videoIndex, e.target.files?.[0] || null)}
              className="file-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor={`videoThumbnail${videoIndex}`}>Video Thumbnail:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleThumbnailChange(videoIndex, e.target.files?.[0] || null)}
              className="file-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor={`quizType${videoIndex}`}>Quiz Type:</label>
            <select
              id={`quizType${videoIndex}`}
              value={video.quizType}
              onChange={(e) => handleQuizTypeChange(videoIndex, e.target.value)}
              className="form-control"
            >
              <option value="">Select Quiz Type</option>
              <option value="dropdown">Dropdown</option>
              <option value="multipleChoice">Multiple Choice</option>
            </select>
          </div>
          {video.quizType && (
            <div className="quiz-fields">
              <h3>Quiz Questions</h3>
              {video.quizQuestions.map((question, questionIndex) => (
                <div key={questionIndex} className="question-group">
                  <div className="form-group">
                    <label htmlFor={`question${videoIndex}_${questionIndex}`}>Question:</label>
                    <input
                      type="text"
                      id={`question${videoIndex}_${questionIndex}`}
                      value={question.question}
                      onChange={(e) => handleQuestionChange(videoIndex, questionIndex, 'question', e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Answer Options:</label>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="option-group">
                        <input
                          type="text"
                          id={`option${videoIndex}_${questionIndex}_${optionIndex}`}
                          value={option}
                          onChange={(e) => handleQuestionChange(videoIndex, questionIndex, 'options', e.target.value, optionIndex)}
                          className="form-control"
                        />
                        {video.quizType === 'multipleChoice' && (
                          <label htmlFor={`correctAnswer${videoIndex}_${questionIndex}_${optionIndex}`}>
                            <input
                              type="radio"
                              name={`correctAnswer${videoIndex}_${questionIndex}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => handleQuestionChange(videoIndex, questionIndex, 'correctAnswer', optionIndex, optionIndex)}
                            />
                            Correct Answer
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => handleAddAnswerOption(videoIndex, questionIndex)}>Add Answer Option</button>
                  <button type="button" onClick={() => handleRemoveQuestion(videoIndex, questionIndex)}>Remove Question</button>
                </div>
              ))}
              <button type="button" onClick={() => handleAddQuestion(videoIndex)}>Add Question</button>
            </div>
          )}
        </div>
      ))}
      <button type="button" onClick={handleAddVideo}>Add Video</button>
      <br />
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
}
