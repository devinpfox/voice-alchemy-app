'use client';

import React, { useState } from 'react';
import Button from '@/components/Button/Button';
import DictionaryPopup from '@/components/DictionaryPopup/DictionaryPopup';
import VideoLibrary from '@/components/VideoLibrary/VideoLibrary';
import GoalsTodosPopup from '@/components/GoalsTodosPopup/GoalsTodosPopup';
import MyProgress from '@/components/MyProgress/MyProgress';
import MyClassesPopup from '@/components/MyClassesPopup/MyClassesPopup';
import ChromaticTuner from '@/components/ChromaticTuner/ChromaticTuner';

export default function HomePage() {
  const [isGoalsTodosOpen, setIsGoalsTodosOpen] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isVideoLibraryOpen, setIsVideoLibraryOpen] = useState(false);
  const [isMyClassesOpen, setIsMyClassesOpen] = useState(false);

  const handleDictionaryClick = () => {
    setIsDictionaryOpen(true);
  };

  const handleCloseDictionary = () => {
    setIsDictionaryOpen(false);
  };

  const handleVideoLibraryClick = () => {
    setIsVideoLibraryOpen(true);
  };

  const handleCloseVideoLibrary = () => {
    setIsVideoLibraryOpen(false);
  };

  const handleGoalsTodosClick = () => {
    console.log('Opening Goals and To-dos');
    setIsGoalsTodosOpen(true);
  };

  const handleCloseGoalsTodos = () => {
    console.log('Closing Goals and To-dos');
    setIsGoalsTodosOpen(false);
  };

  const handleMyClassesClick = () => {
    setIsMyClassesOpen(true);
  };

  const handleCloseMyClasses = () => {
    setIsMyClassesOpen(false);
  };

  return (
    <div className="home-page-container">
      <div className="top-part-container">
        <span className="progress-bar">
          <h2 style={{ color: "white", fontFamily: "Montserrat", fontSize: "20px", fontWeight: "400" }}>Class Progress</h2>
          <MyProgress />
        </span>
        <p style={{ color: "transparent", fontFamily: "Montserrat", marginTop: "-4%" }}>hi</p>
        <span className="myClasses">
          <Button label="My Classes" onClick={handleMyClassesClick} />
        </span>
        <Button label="Goals and To-dos" onClick={handleGoalsTodosClick} />
      </div>
      <div className="earTrainingContainer">
        <ChromaticTuner />
      </div>
      <div className="button-container">
        <div className="button-column">
          <Button label="VIDEO LIBRARY" onClick={handleVideoLibraryClick} />
          <Button label="LIBRARY" onClick={handleDictionaryClick} />
        </div>
        <div className="button-column">
          <Button label="FIND A COACH" />
          <Button label="METRONOME" />
        </div>
      </div>
      {isDictionaryOpen && <DictionaryPopup onClose={handleCloseDictionary} />}
      {isVideoLibraryOpen && <VideoLibrary onClose={handleCloseVideoLibrary} />}
      {isGoalsTodosOpen && <GoalsTodosPopup onClose={handleCloseGoalsTodos} />}
      {isMyClassesOpen && <MyClassesPopup onClose={handleCloseMyClasses} />}
    </div>
  );
}
