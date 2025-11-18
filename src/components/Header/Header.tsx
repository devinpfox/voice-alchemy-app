'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Header() {
  const [currentTime, setCurrentTime] = useState('');
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, [supabase]);

  useEffect(() => {
    const timerID = setInterval(() => {
      const date = new Date();
      const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCurrentTime(time);
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  return (
    <div className="header">
      <div className="header-left">
        <img
          src={user?.user_metadata?.avatar_url || '/user-id-icon.png'}
          alt="User Profile"
          className="profile-pic"
        />
        <span className="welcome-message">
          Welcome, {user?.user_metadata?.full_name || user?.email || 'guest'}
        </span>
      </div>
      <div className="header-right">
        <span className="current-time">{currentTime}</span>
      </div>
    </div>
  );
}
