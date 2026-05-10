import React, { useRef, useEffect, useState, useCallback } from 'react';

interface AudioVisualizerProps {
  audioUrl: string;
  /** Opcjonalnie: crossOrigin dla audio (domyślnie "anonymous") */
  crossOrigin?: string;
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

  // Funkcja pomocnicza do bezpiecznego zamknięcia kontekstu audio
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

  // Inicjalizacja audio kontekstu i podłączenie analizatora
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

  // Rysowanie wizualizacji – uruchamiana raz, animuje w pętli
  const drawVisualizer = useCallback(() => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      // Tło
      ctx.fillStyle = 'rgb(20, 20, 20)';
      ctx.fillRect(0, 0, width, height);

      // Parametry słupków – wszystkie mieszczą się w canvasie
      const barWidth = width / bufferLength - 1; // zostawiamy 1 px odstępu
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];

        // Obliczanie koloru z obcięciem wartości RGB
        const r = Math.min(255, value + Math.floor(25 * (i / bufferLength)));
        const g = 50;
        const b = Math.min(255, 250 - Math.floor(value / 2));

        ctx.fillStyle = `rgb(${r},${g},${b})`;

        // Wysokość słupka – skalujemy do canvasu
        const barHeight = (value / 255) * height; // pełna wysokość lub połowa: /2
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1; // przesuwamy o szerokość słupka + odstęp
      }
    };

    draw();
  }, []);

  // Obsługa play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    // Pierwsze kliknięcie – tworzymy kontekst (wymagane po interakcji użytkownika)
    if (!audioContextRef.current) {
      setupAudio();
    }

    // Wznawiamy zawieszony kontekst (polityka autoplay)
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setError(null);
          // Uruchamiamy wizualizację tylko jeśli jeszcze nie jest aktywna
          if (animationRef.current === null) {
            drawVisualizer();
          }
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

  // Zatrzymanie animacji po zakończeniu utworu
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Reakcja na zmianę URL – restart kontekstu i źródła
  useEffect(() => {
    // Zamykamy stary kontekst i przygotowujemy się na nowe URL
    closeAudioContext();
    setError(null);
    // Nie tworzymy nowego kontekstu od razu – zrobi to setupAudio po kliknięciu play
  }, [audioUrl, closeAudioContext]);

  // Czyszczenie przy odmontowaniu komponentu
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
        gap: '20px',
        padding: '20px',
      }}
    >
      <audio
        key={audioUrl} 
        ref={audioRef}
        src={audioUrl}
        crossOrigin={crossOrigin}
        onEnded={handleEnded}
        onError={() => setError('Błąd wczytywania pliku audio.')}
      />

      <canvas
        ref={canvasRef}
        width={500}
        height={200}
        style={{
          borderRadius: '8px',
          // boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          // background: '#141414', // zapasowe tło
        }}
      />

      {error && (
        <div style={{ color: '#f87171', fontWeight: 'bold' }}>{error}</div>
      )}

      <button
        onClick={togglePlay}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: '4px',
          border: 'none',
          background: '#3b82f6',
          color: 'white',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#2563eb')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#3b82f6')}
      >
        {isPlaying ? 'Pauza' : 'Odtwórz'}
      </button>
    </div>
  );
};

export default AudioVisualizer;