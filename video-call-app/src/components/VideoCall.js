import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const SERVER_URL = "http://localhost:3001";
const socket = io.connect(SERVER_URL);

function VideoCall() {
    const [peers, setPeers] = useState({});
    const [stream, setStream] = useState(null);
    const [audioMuted, setAudioMuted] = useState(false);
    const [videoMuted, setVideoMuted] = useState(false);
    const [sharedFile, setSharedFile] = useState(null);
    const { roomId } = useParams();
    const [meetingDetails, setMeetingDetails] = useState(`Meeting ID: ${roomId}`);
    const userVideoRef = useRef();
    const navigate = useNavigate();
  const handleReceiveSignal = useCallback((data) => {
    const { signal, socketId } = data;

    if (!peers[socketId]) {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream
      });

      peer.on('signal', signalData => {
        socket.emit('signal', { signal: signalData, targetSocketId: socketId });
      });

      setPeers(prevPeers => ({
        ...prevPeers,
        [socketId]: peer
      }));
    }

    peers[socketId].signal(signal);
  }, [peers, stream]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSharedFile(file);
  };
  const handleShareFile = () => {
    // Convert the file to Base64 and then emit it to the server
    const reader = new FileReader();
    reader.readAsDataURL(sharedFile);
    reader.onloadend = () => {
      socket.emit('share-file', { roomId, file: reader.result });
    };
  };
  useEffect(() => {
    // Attempt to get user's video and audio stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(localStream => {
        setStream(localStream);
        userVideoRef.current.srcObject = localStream;

        // Once the stream is acquired, join the room and setup other socket events
        socket.emit('join-room', roomId);
        socket.on('user-connected', (socketId) => {
          const newPeer = createPeer(socketId, localStream);
          setPeers(prevPeers => ({
            ...prevPeers,
            [socketId]: newPeer
          }));
        });

        socket.on('signal', handleReceiveSignal);

        return () => {
          socket.off();
        };
      })
      .catch(err => {
        console.error('Error accessing media devices.', err);
        // Handle the error appropriately. For example, show a message to the user.
        alert('Could not access the camera or microphone. Please ensure they are connected and not in use by another application.');
      });
  }, [handleReceiveSignal, roomId]);

  const handleLeaveCall = () => {
    // Close Peer Connections
    Object.values(peers).forEach(peer => {
      if (peer) {
        peer.destroy();
      }
    });
  
    // Close local media stream
    const localStream = userVideoRef.current.srcObject;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  
    // Close the socket connection
    socket.disconnect();
  
    // Redirect user
    navigate('/');
  };
  const createPeer = (socketId, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on('signal', signal => {
      socket.emit('signal', { signal, targetSocketId: socketId });
    });

    return peer;
  };

  const toggleMuteAudio = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = audioMuted;
      setAudioMuted(!audioMuted);
    }
  };

  const toggleMuteVideo = () => {
    if (stream) {
      const enabled = stream.getVideoTracks()[0].enabled;
      if (enabled) {
        stream.getVideoTracks()[0].enabled = false;
      } else {
        stream.getVideoTracks()[0].enabled = true;
      }
      setVideoMuted(!enabled);
    }
  };
  

  const startCall = () => {
    // You might need more complex logic here if you want to initiate calls differently
    // For now, this will just start the user's video and join them to the room
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(localStream => {
        setStream(localStream);
        userVideoRef.current.srcObject = localStream;
      });
  };
  const shareScreen = () => {
    navigator.mediaDevices.getDisplayMedia({ cursor: true })
      .then(screenStream => {
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = stream.getSenders().find(sender => sender.track.kind === 'video');
        sender.replaceTrack(videoTrack);
      })
      .catch(err => console.error('Error sharing screen: ', err));
  };
  useEffect(() => {
    socket.on('receive-file', (file) => {
      // For simplicity, we'll just prompt the user to download the file
      const downloadLink = document.createElement('a');
      downloadLink.href = file;
      downloadLink.download = 'shared-file.txt';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });

    return () => {
      socket.off('receive-file');
    };
  }, []);

  return (
    <div className="video-container">
        <div>{meetingDetails}</div> 
      <video ref={userVideoRef} autoPlay muted></video>
      <div className="video-grid">
        {Object.values(peers).map(peer => (
          <Video key={peer._id} peer={peer} />
        ))}
      </div>
      {/* Conditionally render the Start Call button */}
      {!stream && <button onClick={startCall}>Start Call</button>}
      
      {/* Remaining buttons and functionality */}
      {stream && <button onClick={shareScreen}>Share Screen</button>}
      {stream && <button onClick={toggleMuteAudio}>
        {audioMuted ? 'Unmute Audio' : 'Mute Audio'}
      </button>}
      {stream && <button onClick={toggleMuteVideo}>
        {videoMuted ? 'Turn On Video' : 'Turn Off Video'}
      </button>}
      <div className="file-sharing-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleShareFile}>Share File</button>
      </div>
      <button onClick={handleLeaveCall}>Leave Call</button>
    </div>
  );
  
}

const Video = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return (
    <video playsInline autoPlay ref={ref}></video>
  );
};

export default VideoCall;
