import React, { useState, useRef, useEffect } from 'react';

const MusicPlayer = ({ musicUrl }: { musicUrl: string }) => {
// 1. Explicitly type the ref
const audioRef = React.useRef<HTMLAudioElement>(null);

useEffect(() => {
  setIsPlaying(false);
  
  // 2. Use a null-check (optional chaining or if statement)
  // This ensures TS knows 'current' isn't null when calling .load()
  audioRef.current?.load(); 
}, [musicUrl]);  const [isPlaying, setIsPlaying] = useState(false);

  // Sync state if the URL changes while music is playing
  useEffect(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.load(); // Reload the player with the new source
    }
  }, [musicUrl]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={styles.container}>
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)} // Reset UI when song finishes
      >
        <source src={musicUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div style={styles.controls}>
        <p style={styles.text}>Now Playing: {musicUrl}</p>
        <button onClick={togglePlay} style={styles.button}>
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    backgroundColor: '#f9f9f9',
    maxWidth: '300px',
    textAlign: 'center',
    margin: '10px auto'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#1DB954', // Spotify green
    color: 'white',
    fontWeight: 'bold'
  },
  text: {
    fontSize: '12px',
    color: '#666',
    wordBreak: 'break-all'
  }
};

export default MusicPlayer;