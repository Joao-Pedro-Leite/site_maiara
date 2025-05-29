import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const AudioPlayer: React.FC = () => {
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (location.pathname === "/") {
      audio.volume = 0.05; // Define o volume inicial
      audio.play().catch((err) => {
        console.warn("Autoplay bloqueado pelo navegador:", err);
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [location.pathname]);

  return (
    <audio
      ref={audioRef}
      src="/data/musica.mp3"
      preload="auto"
      loop // Faz a música tocar em repetição
    />
  );
};

export default AudioPlayer;
