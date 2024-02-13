import {
  IconBugFilled,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconVolume3,
  IconVolumeOff,
} from "@tabler/icons-react";
import { createRef, useEffect, useState } from "react";
import { formatDuration } from "~/utils/format-duration";

type PlayerProps = {
  length: number;
  source: string;
  thumbnail: string;
};

const defaultVolume = 0.5;
const volumeLevels = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

export const Player = ({ length, source, thumbnail }: PlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [progress, setProgress] = useState(0);
  const [isDebug, setIsDebug] = useState(false);
  const [date, setDate] = useState(new Date().toString());

  const audioRef = createRef<HTMLAudioElement>();

  const play = () => {
    if (audioRef.current) {
      audioRef.current?.play();
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

  const toggleMute = () => {
    setIsMuted((prevIsMuted) => !prevIsMuted);
    setVolume(isMuted ? defaultVolume : 0);
  };

  const toggleDebug = () => setIsDebug((prev) => !prev);

  const handleProgressClick = (event: React.MouseEvent<HTMLInputElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const newProgress = Math.floor(length * (x / rect.width));
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
          if (prevProgress >= length) {
            handleEnded();
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
    let dateInterval: NodeJS.Timeout;
    if (isDebug) {
      dateInterval = setInterval(() => setDate(new Date().toString()), 1000);
    }

    return () => clearInterval(dateInterval);
  }, [isDebug]);

  return (
    <div className="h-full w-full bg-stone-950 flex flex-col text-white">
      <div className="relative flex-1 flex flex-col gap-2 items-center justify-center">
        {/* debug stats */}
        {isDebug ? (
          <div className="absolute bg-stone-900/50 top-4 left-4 z-10 p-4 text-sm font-mono flex items-start">
            <table className="flex-1">
              <tbody>
                <tr>
                  <td className="text-right pr-2">Debug</td>
                  {isDebug ? (
                    <td className="text-green-400">On</td>
                  ) : (
                    <td className="text-red-400">off</td>
                  )}
                </tr>
                <tr>
                  <td className="text-right pr-2">Playing</td>
                  {isPlaying ? (
                    <td className="text-green-400">Yes</td>
                  ) : (
                    <td className="text-red-400">No</td>
                  )}
                </tr>
                <tr>
                  <td className="text-right pr-2">Volume</td>
                  <td>{volume * 100}%</td>
                </tr>
                <tr>
                  <td className="text-right pr-2">Thumbnail</td>
                  <td className="text-yellow-400">
                    <a
                      href={thumbnail}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {thumbnail}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="text-right pr-2">Source</td>
                  <td className="text-yellow-400">
                    <a
                      href={source}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {source}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="text-right pr-2">Length</td>
                  <td className="text-blue-400">{length} seconds</td>
                </tr>
                <tr>
                  <td className="text-right pr-2">Progress</td>
                  <td className="text-green-400">{progress} seconds</td>
                </tr>
                <tr>
                  <td className="text-right pr-2">Date</td>
                  <td className="text-fuchsia-400">{date}</td>
                </tr>
              </tbody>
            </table>
            <X onClick={toggleDebug} className="size-5 cursor-pointer" />
          </div>
        ) : null}
        {/* CD */}
        <div className="w-32 h-32 rounded-full overflow-hidden">
          <img
            src={thumbnail}
            alt=""
            className={`h-full w-full object-cover
               ${isPlaying ? "animate-spin-slow" : ""}`}
          />
          <audio ref={audioRef} onEnded={handleEnded} muted={isMuted}>
            <source src={source} type="audio/mp3"></source>
            <track
              kind="captions"
              srcLang="en"
              label="english_captions"
            ></track>
          </audio>
        </div>
      </div>
      <div
        className="h-1 hover:h-2 transition-all bg-stone-600 cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-red-500"
          style={{ width: `${(progress / length) * 100}%` }}
        ></div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={togglePlay}>
            {isPlaying ? <IconPlayerPauseFilled /> : <IconPlayerPlayFilled />}
          </button>
          <button onClick={toggleMute}>
            {isMuted ? <IconVolumeOff /> : <IconVolume3 />}
          </button>
          <button onClick={increaseVolume}>{volume * 100}%</button>
          <div>
            {formatDuration(progress)} / {formatDuration(length)}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleDebug}>
            <IconBugFilled />
          </button>
        </div>
      </div>
    </div>
  );
};
