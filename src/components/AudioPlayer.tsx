import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const AudioPlayer: React.FC = () => {
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [canPlay, setCanPlay] = useState(false);

  const handleEnableAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.05;
      audio.play().catch((err) => {
        console.warn("Erro ao tentar tocar o áudio:", err);
      });
      setCanPlay(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !canPlay) return;

    if (location.pathname === "/") {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [location.pathname, canPlay]);

  return (
    <>
      {!canPlay && location.pathname === "/" && (
        <button
          onClick={handleEnableAudio}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 1000,
            padding: "10px 20px",
            fontSize: "16px",
          }}
        >
          🔊 Ativar Som
        </button>
      )}
      <audio ref={audioRef} src="/data/musica.mp3" loop preload="auto" />
    </>
  );
};

export default AudioPlayer;
