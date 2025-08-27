"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Maximize2,
  List,
  Minimize2,
  X,
  Clock
} from 'lucide-react';
import { Button } from './Button';

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  file: string;
  duration: number;
  episode_number: number;
  podcast: string;
  is_published: boolean;
}

interface ModernPodcastPlayerProps {
  episode: PodcastEpisode | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onToggleLike?: () => void;
  isLiked?: boolean;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export function ModernPodcastPlayer({
  episode,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false
}: ModernPodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (episode && audioRef.current) {
      audioRef.current.src = episode.file;
      audioRef.current.load();
      setCurrentTime(0);
      setDuration(episode.duration);
    }
  }, [episode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
      } else if (repeatMode === 'all' && onNext) {
        onNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode, onNext]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleShuffle = () => setIsShuffled(!isShuffled);
  
  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'one';
      if (prev === 'one') return 'all';
      return 'none';
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !episode) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200/60 shadow-lg z-50">
      <audio ref={audioRef} />
      
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Informations de l'épisode */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-slate-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-800 truncate">{episode.title}</h4>
              <p className="text-sm text-slate-500">Episode #{episode.episode_number}</p>
            </div>
          </div>

          {/* Contrôles principaux */}
          <div className="flex items-center gap-4">
            <Button
              onClick={toggleShuffle}
              className={`p-2 rounded-lg transition-colors ${
                isShuffled 
                  ? 'bg-gradient-to-r from-[#005929]/20 to-[#FE5200]/20 text-[#005929]' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </Button>

            <Button
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              onClick={togglePlay}
              className="p-3 rounded-full bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>

            <Button
              onClick={onNext}
              disabled={!hasNext}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            <Button
              onClick={toggleRepeat}
              className={`p-2 rounded-lg transition-colors ${
                repeatMode !== 'none'
                  ? 'bg-gradient-to-r from-[#005929]/20 to-[#FE5200]/20 text-[#005929]' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Repeat className="w-4 h-4" />
              {repeatMode === 'one' && <span className="text-xs ml-1">1</span>}
            </Button>
          </div>

          {/* Barre de progression */}
          <div className="flex-1 mx-8">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #005929 0%, #005929 ${(currentTime / (duration || 1)) * 100}%, #e2e8f0 ${(currentTime / (duration || 1)) * 100}%, #e2e8f0 100%)`
                  }}
                />
              </div>
              <span className="text-xs text-slate-500 w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Contrôles secondaires */}
          <div className="flex items-center gap-3">
    

            <div className="flex items-center gap-2">
              <Button
                onClick={toggleMute}
                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #005929 0%, #005929 ${(isMuted ? 0 : volume) * 100}%, #e2e8f0 ${(isMuted ? 0 : volume) * 100}%, #e2e8f0 100%)`
                }}
              />
            </div>

            <Button
              onClick={() => setShowQueue(!showQueue)}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <List className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>

            <Button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #005929;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #005929;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
