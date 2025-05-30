import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const AudioPlayer: React.FC = () => {
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [canPlay, setCanPlay] = useState(false);

  const handleEnableAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3;
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
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 24px",
            fontSize: "16px",
            background: "#fff",
            color: "#333",
            border: "1px solid #ccc",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
        >
          🔊 Ativar Som
        </button>
      )}
      <audio ref={audioRef} src="/data/musica.mp3" preload="auto" loop />
    </>
  );
};

export default AudioPlayer;
