'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const placeHolder = '/user-id-icon.png';

export default function SettingsPage() {
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const router = useRouter();

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePhoto(event.target.files[0]);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);

      // Replace with your API endpoint
      // const response = await fetch('/api/settings/update', {
      //   method: 'POST',
      //   body: formData,
      // });

      console.log('Updated user settings');
    } catch (error) {
      console.error('Error updating user settings:', error);
    }
  };

  const handleProfilePictureSubmit = async () => {
    if (profilePhoto) {
      const formData = new FormData();
      formData.append('profilePhoto', profilePhoto);

      try {
        // Replace with your API endpoint
        // const response = await fetch('/api/profile/upload', {
        //   method: 'POST',
        //   body: formData,
        // });

        console.log('Uploaded profile picture');
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      <div className="profile-photo-section">
        <div className="left-section">
          <img
            src={profilePhoto ? URL.createObjectURL(profilePhoto) : placeHolder}
            alt="Profile"
            className="profile-photo"
          />
          <div className="user-details">
            <p>{name || 'User Name'}</p>
            <a href="#" className="change-profile-link">Change Profile Picture</a>
          </div>
        </div>
        <div className="right-section">
          <label>Profile Photo</label>
          <input type="file" accept="image/*" onChange={handleProfilePhotoChange} className="file-input" />
          <button type="button" onClick={handleProfilePictureSubmit}>
            Upload Profile Picture
          </button>
        </div>
      </div>
      <form className="settings-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <label>
          Bio:
          <textarea value={bio} onChange={handleBioChange} rows={4} />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}