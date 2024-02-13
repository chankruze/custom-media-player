import {
  IconArrowsShuffle,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconRepeat,
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconVolumeOff,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Media } from "~/db/media-list";
import { formatDuration } from "~/utils/format-duration";

type PlayerProps = {
  media: Media;
};

const defaultVolume = 0.8;
const volumeLevels = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

export const MiniPlayer = ({ media }: PlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>();
  const previousAudioSrcRef = useRef<string>();

  const play = () => {
    if (audioRef.current) {
      if (previousAudioSrcRef.current) {
        if (audioRef.current.src !== previousAudioSrcRef.current) {
          audioRef.current.play();
          previousAudioSrcRef.current = audioRef.current.src;
          setIsPlaying(true);
        }
      }

      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const toggleLoop = () => {
    setIsLoop((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prevIsMuted) => !prevIsMuted);
    setVolume(isMuted ? defaultVolume : 0);
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLInputElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const newProgress = Math.floor(media.duration * (x / rect.width));
    setProgress(newProgress);
  };

  const handleEnded = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setProgress(0);
  };

  const increaseVolume = () => {
    const index = volumeLevels.indexOf(volume);
    if (index < volumeLevels.length - 1) {
      setVolume(volumeLevels[index + 1]);
    } else {
      setVolume(volumeLevels[0]);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= media.duration) {
            if (!isLoop) handleEnded();
            return 0;
          } else {
            return prevProgress + 1;
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      if (progress) {
        audioRef.current.currentTime = progress;
        if (!isPlaying) play();
      }
    }
  }, [progress]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      // Add event listener to check for changes in src
      audioRef.current.addEventListener("play", play);
    }
    // Cleanup function to remove event listener
    return () => {
      if (audioRef.current) audioRef.current.removeEventListener("play", play);
    };
  }, [audioRef.current]);

  return (
    <div className="h-full w-full bg-white flex flex-col">
      {/* progress bar */}
      <div
        className="h-1 hover:h-2 transition-all bg-stone-100 cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-green-500"
          style={{ width: `${(progress / media.duration) * 100}%` }}
        ></div>
      </div>
      {/* actions */}
      <div className="p-3 grid grid-cols-3">
        {/* song info */}
        <div className="flex items-center gap-2">
          <div className="w-14 h-14 rounded-lg overflow-hidden">
            <img
              src={media.thumbnail}
              alt=""
              className="h-full w-full object-cover"
            />
            <audio
              ref={audioRef}
              onEnded={handleEnded}
              muted={isMuted}
              loop={isLoop}
              hidden
            >
              <source src={media.url} type="audio/mp3"></source>
              <track
                kind="captions"
                srcLang="en"
                label="english_captions"
              ></track>
            </audio>
          </div>
          <div>
            <h1 className="font-medium">{media.name}</h1>
            <p className="text-sm text-stone-500">{media.album}</p>
          </div>
        </div>
        {/* mid */}
        <div className="h-full place-self-center flex items-center gap-4">
          <button onClick={toggleLoop}>
            <IconRepeat
              className={`size-6 ${
                isLoop ? "text-green-500" : "text-stone-500"
              }`}
            />
          </button>
          <button onClick={togglePlay} disabled>
            <IconPlayerSkipBackFilled className="size-6" />
          </button>
          <button onClick={togglePlay}>
            {isPlaying ? (
              <IconPlayerPauseFilled className="size-8" />
            ) : (
              <IconPlayerPlayFilled className="size-8" />
            )}
          </button>
          <button onClick={togglePlay} disabled>
            <IconPlayerSkipForwardFilled className="size-6" />
          </button>
          <button onClick={togglePlay} disabled>
            <IconArrowsShuffle className="size-6" />
          </button>
        </div>
        <div className="h-full place-self-end flex items-center gap-4">
          <div>
            {formatDuration(progress)} / {formatDuration(media.duration)}
          </div>
          <button onClick={toggleMute}>
            {isMuted ? <IconVolumeOff /> : null}
            {volume >= 0.8 ? <IconVolume /> : null}
            {volume > 0.2 && volume < 0.8 ? <IconVolume2 /> : null}
            {volume > 0 && volume <= 0.2 ? <IconVolume3 /> : null}
          </button>
          <button onClick={increaseVolume}>{volume * 100}%</button>
        </div>
      </div>
    </div>
  );
};
