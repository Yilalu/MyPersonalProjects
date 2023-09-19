import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const [meetingId, setMeetingId] = useState('');

  const startNewCall = () => {
    const roomId = Math.random().toString(36).substring(7);
    navigate(`/video/${roomId}`);
  };

  const joinExistingCall = () => {
    if (meetingId) {
      navigate(`/video/${meetingId}`);
    }
  };

  return (
    <div className="home-page-container">
      <button onClick={startNewCall}>Start New Call</button>
      <div>
        <input type="text" placeholder="Meeting ID" value={meetingId} onChange={e => setMeetingId(e.target.value)} />
        <button onClick={joinExistingCall}>Join</button>
      </div>
    </div>
  );
}

export default HomePage;
