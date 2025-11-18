'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaUser, FaCalendarAlt, FaEnvelope, FaCog } from 'react-icons/fa';

export default function StickyFooterToolbar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleIconClick = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="sticky-footer-toolbar">
      <Link href="/dashboard" className={`icon-column ${isSettingsOpen ? 'clicked' : ''}`}>
        <FaUser />
      </Link>
      <Link href="/calendar" className={`icon-column ${isSettingsOpen ? 'clicked' : ''}`}>
        <FaCalendarAlt />
      </Link>
      <Link href="/messages" className={`icon-column ${isSettingsOpen ? 'clicked' : ''}`}>
        <FaEnvelope />
      </Link>
      <Link href="/settings" className={`icon-column ${isSettingsOpen ? 'clicked' : ''}`}>
        <FaCog />
      </Link>
    </div>
  );
}
