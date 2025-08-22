'use client';

import React, { useState, useRef } from 'react';
import { ApiSong } from '@/shared/types/api';
import Image from 'next/image';
import { 
  X, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  List, 
  Music 
} from 'lucide-react';
import { useUnifiedMusicPlayer } from '@/hooks/useUnifiedMusicPlayer';

interface MusicPlayerProps {
  currentTrack: ApiSong | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onClose: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
  isShuffleOn: boolean;
  repeatMode: 'none' | 'one' | 'all';
  currentTime: number;
  duration: number;
}

export function MusicPlayer({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onClose,
  onShuffle,
  onRepeat,
  isShuffleOn,
  repeatMode,
  currentTime,
  duration,
}: MusicPlayerProps) {
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  // Utiliser le hook unifié pour accéder aux nouvelles fonctionnalités
  const {
    queue,
    selectTrack,
    formatTime: formatTimeUtil,
    hasNext,
    hasPrevious,
  } = useUnifiedMusicPlayer();

  const progressRef = useRef<HTMLDivElement>(null);

  const formatTime = (time: number) => {
    return formatTimeUtil(time);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    onSeek(newTime);
  };

  const handleTrackSelect = (index: number) => {
    selectTrack(index);
    setShowPlaylist(false);
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-orange-400 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Informations de la piste (gauche) */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <Image
            src={currentTrack?.album?.cover || '/images/cover_default.jpg'}
            alt={currentTrack.title}
            className="w-12 h-12 rounded object-cover"
            width={400}
            height={400}
          />
          <div className="min-w-0">
            <h3 className="text-black text-lg font-medium truncate">{currentTrack.title}</h3>
            <p className="text-black text-sm truncate">{currentTrack.artist.stage_name}</p>
          </div>
        </div>

        {/* Contrôles de lecture (centre) */}
        <div className="flex items-center space-x-4">
          {/* Bouton lecture aléatoire */}
          <button
            onClick={onShuffle}
            disabled
            className={`transition-colors ${
              isShuffleOn 
                ? 'text-[#FE5200]' 
                : 'text-gray-400 hover:text-[#FE5200]'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`transition-colors cursor-pointer ${
              hasPrevious 
                ? 'text-gray-400 hover:text-[#FE5200]' 
                : 'text-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={onPlayPause}
            className="bg-white text-gray-900 rounded-full p-2 hover:bg-gray-200 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`transition-colors cursor-pointer ${
              hasNext 
                ? 'text-gray-400 hover:text-[#FE5200]' 
                : 'text-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            <SkipForward className="w-6 h-6" />
          </button>

          {/* Bouton répétition */}
          <button
            onClick={onRepeat}
            disabled
            className={`transition-colors relative ${
              repeatMode === 'none' 
                ? 'text-gray-400 hover:text-[#FE5200]' 
                : 'text-[#FE5200]'
            }`}
          >
            {repeatMode === 'one' ? (
              <>
                <Repeat1 className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FE5200] rounded-full flex items-center justify-center text-xs font-bold text-white">1</span>
              </>
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>

          {/* Bouton playlist */}
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="text-gray-400 hover:text-[#FE5200] transition-colors"
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        {/* Barre de progression et contrôles (droite) */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          {/* Visualiseur audio */}
          <div className="flex items-center space-x-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-orange-500 rounded-full audio-wave-bar ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
                style={{
                  height: `${Math.random() * 20 + 5}px`,
                }}
              />
            ))}
          </div>

          {/* Barre de progression */}
          <div className="flex items-center space-x-2 min-w-0 flex-1 max-w-md">
            <span className="text-gray-400 text-xs whitespace-nowrap">
              {formatTime(currentTime)}
            </span>
            <div 
              ref={progressRef}
              className="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer relative"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-[#FE5200] rounded-full transition-all duration-150"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
              <div 
                className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150"
                style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="text-gray-400 text-xs whitespace-nowrap">
              {formatTime(duration)}
            </span>
          </div>

          {/* Contrôles supplémentaires */}
          <div className="flex items-center space-x-2">
            {/* Close button */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-[#FE5200] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Playlist */}
      {showPlaylist && queue.length > 0 && (
        <div className="border-t border-gray-300 bg-gray-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Liste de lecture</h3>
            <div className="max-h-64 overflow-y-auto">
              {queue.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => handleTrackSelect(index)}
                  className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                    index === queue.findIndex(t => t.id === currentTrack?.id)
                      ? 'bg-white text-[#FE5200]' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center flex-shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{track.title}</p>
                    <p className="text-sm text-gray-500 truncate">{track.artist.stage_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
