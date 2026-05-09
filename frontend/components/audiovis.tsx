import React, { useRef, useEffect, useState, useCallback } from 'react';

interface AudioVisualizerProps {
  audioUrl: string;
  crossOrigin?: string;
}

// Helper: draw a rounded rectangle
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioUrl,
  crossOrigin = 'anonymous',
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeAudioContext = useCallback(async () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      await audioContextRef.current.close();
      audioContextRef.current = null;
      analyserRef.current = null;
      sourceRef.current = null;
    }
  }, []);

  const setupAudio = useCallback(() => {
    if (audioContextRef.current || !audioRef.current) return;
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaElementSource(audioRef.current);
      sourceRef.current = source;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    } catch (err) {
      setError('Nie udało się zainicjalizować kontekstu audio.');
      console.error(err);
    }
  }, []);

  const drawVisualizer = useCallback(() => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;

    const numberOfBars = 120;
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = 3.2;
    const gap = .6;
    const totalBarsWidth = numberOfBars * barWidth + (numberOfBars - 1) * gap;
    const startX = centerX - totalBarsWidth / 2;
    const maxBarHeight = radius * 0.8;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Clear and draw background circle
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, width, height);

      // Outer circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 12, 0, Math.PI * 2);
      ctx.fillStyle = '#111122';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
      ctx.fillStyle = '#1a1a2e';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 4, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0a1a';
      ctx.fill();

      // Frequency segments
      const segmentSize = bufferLength / numberOfBars;
      for (let i = 0; i < numberOfBars; i++) {
        const start = Math.floor(i * segmentSize);
        const end = Math.floor((i + 1) * segmentSize);
        let sum = 0;
        for (let j = start; j < end; j++) {
          sum += dataArray[j];
        }
        const avg = sum / (end - start);
        let normalized = avg / 255;
        const barTotalHeight = normalized * maxBarHeight * 2;
        const barHalfHeight = barTotalHeight / 2;

        const x = startX + i * (barWidth + gap);
        const barTop = centerY - barHalfHeight;
        const barBottom = centerY + barHalfHeight;
        const barHeight = barBottom - barTop;

        const hue = 200 + normalized * 160;
        ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
        drawRoundedRect(ctx, x, barTop, barWidth, barHeight, 8);
        ctx.fill();
      }

      // Center line and dots
      ctx.beginPath();
      ctx.moveTo(centerX - radius - 10, centerY);
      ctx.lineTo(centerX + radius + 10, centerY);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // for (let i = 0; i < numberOfBars; i++) {
      //   const x = startX + i * (barWidth + gap) + barWidth / 2;
      //   ctx.beginPath();
      //   ctx.arc(x, centerY, 3, 0, Math.PI * 2);
      //   ctx.fillStyle = '#ffffff';
      //   ctx.fill();
      // }
    };
    draw();
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (!audioContextRef.current) setupAudio();
    if (audioContextRef.current?.state === 'suspended')
      audioContextRef.current.resume();

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setError(null);
          if (animationRef.current === null) drawVisualizer();
        })
        .catch((err) => {
          setError('Nie można odtworzyć audio.');
          console.error(err);
        });
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  }, [setupAudio, drawVisualizer]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  useEffect(() => {
    const cleanup = async () => {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      setError(null);
      await closeAudioContext();
    };
    cleanup();
  }, [audioUrl, closeAudioContext]);

  useEffect(() => {
    return () => {
      closeAudioContext();
    };
  }, [closeAudioContext]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        padding: '20px',
      }}
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        crossOrigin={crossOrigin}
        onEnded={handleEnded}
        onError={() => setError('Błąd wczytywania pliku audio.')}
      />
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          background: '#0a0a1a',
        }}
      />
      {error && <div style={{ color: '#f87171', fontWeight: 'bold' }}>{error}</div>}
      <button
        onClick={togglePlay}
        style={{
          padding: '10px 24px',
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: '40px',
          border: 'none',
          background: '#3b82f6',
          color: 'white',
          fontWeight: 'bold',
          transition: 'background 0.2s, transform 0.1s',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#2563eb')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#3b82f6')}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {isPlaying ? '⏸️ Pauza' : '▶️ Odtwórz'}
      </button>
    </div>
  );
};

export default AudioVisualizer;