'use client';

import React from 'react';

interface MyClassesPopupProps {
  onClose: () => void;
}

export default function MyClassesPopup({ onClose }: MyClassesPopupProps) {
  return (
    <>
      <div className="popup-overlay" onClick={onClose}></div>
      <div className="my-classes-popup">
        <div className="popup-header">
          <h2>My Classes</h2>
          <div className="close-icon" onClick={onClose}>
            X
          </div>
        </div>
        <div className="classes-list">
          <ul>
            <li>
              <a href="/live/session-1">Personal Mentorship</a>
            </li>
            <li>
              <a href="/courses">Video Course 1</a>
            </li>
            <li>
              <a href="/courses">Video Course 2</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
