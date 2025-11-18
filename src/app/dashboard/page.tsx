'use client';

import { useState } from 'react';
import Button from '@/components/Button/Button';
import MyProgress from '@/components/MyProgress/MyProgress';
import ChromaticTuner from '@/components/ChromaticTuner/ChromaticTuner';
import GoalsTodosPopup from '@/components/GoalsTodosPopup/GoalsTodosPopup';
import MyClassesPopup from '@/components/MyClassesPopup/MyClassesPopup';
import VideoLibraryModal from '@/components/modals/VideoLibraryModal';
import DictionaryModal from '@/components/modals/DictionaryModal';
import FindCoachModal from '@/components/modals/FindCoachModal';
import MetronomeModal from '@/components/modals/MetronomeModal';

export default function DashboardPage() {
  const [isGoalsTodosOpen, setIsGoalsTodosOpen] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isVideoLibraryOpen, setIsVideoLibraryOpen] = useState(false);
  const [isMyClassesOpen, setIsMyClassesOpen] = useState(false);
  const [isFindCoachOpen, setIsFindCoachOpen] = useState(false);
  const [isMetronomeOpen, setIsMetronomeOpen] = useState(false);

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
    setIsGoalsTodosOpen(true);
  };

  const handleCloseGoalsTodos = () => {
    setIsGoalsTodosOpen(false);
  };

  const handleMyClassesClick = () => {
    setIsMyClassesOpen(true);
  };

  const handleCloseMyClasses = () => {
    setIsMyClassesOpen(false);
  };

  const handleFindCoachClick = () => {
    setIsFindCoachOpen(true);
  };

  const handleCloseFindCoach = () => {
    setIsFindCoachOpen(false);
  };

  const handleMetronomeClick = () => {
    setIsMetronomeOpen(true);
  };

  const handleCloseMetronome = () => {
    setIsMetronomeOpen(false);
  };

  return (
    <div className="home-page-container">
      <div className="top-part-container">
        <span className="progress-bar">
          <h2 style={{ color: "white", fontFamily: "Montserrat", fontSize: "20px", fontWeight: "400" }}>
            Class Progress
          </h2>
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
          <Button label="FIND A COACH" onClick={handleFindCoachClick} />
          <Button label="METRONOME" onClick={handleMetronomeClick} />
        </div>
      </div>

      {isDictionaryOpen && <DictionaryModal onClose={handleCloseDictionary} />}
      {isVideoLibraryOpen && <VideoLibraryModal onClose={handleCloseVideoLibrary} />}
      {isGoalsTodosOpen && <GoalsTodosPopup onClose={handleCloseGoalsTodos} />}
      {isMyClassesOpen && <MyClassesPopup onClose={handleCloseMyClasses} />}
      {isFindCoachOpen && <FindCoachModal onClose={handleCloseFindCoach} />}
      {isMetronomeOpen && <MetronomeModal onClose={handleCloseMetronome} />}
    </div>
  );
}
