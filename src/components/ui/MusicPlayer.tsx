'use client';

import React, { useState } from 'react';
import { ApiSong } from '@/shared/types/api';
import Image from 'next/image';
interface MusicPlayerProps {
  currentTrack: ApiSong | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  currentTime: number;
  duration: number;
  volume: number;
}

export function MusicPlayer({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  currentTime,
  duration,
  volume
}: MusicPlayerProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    onSeek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
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
            src={currentTrack.cover || '/images/cover_default.jpg'}
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
          <button
            onClick={onPrevious}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
            </svg>
          </button>

          <button
            onClick={onPlayPause}
            className="bg-white text-gray-900 rounded-full p-2 hover:bg-gray-200 transition-colors"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            onClick={onNext}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
            </svg>
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
                         <input
               type="range"
               min="0"
               max={duration || 100}
               value={currentTime}
               onChange={handleSeek}
               className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer music-player-slider"
             />
            <span className="text-gray-400 text-xs whitespace-nowrap">
              {formatTime(duration)}
            </span>
          </div>

          {/* Contrôles supplémentaires */}
          <div className="flex items-center space-x-2">
            {/* Volume */}
            <div className="relative">
              <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="text-gray-400 hover:text-[#FE5200] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.5l3.883-2.793a1 1 0 011.617.793zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {showVolumeSlider && (
                <div className="absolute bottom-full right-0 mb-2 p-2 bg-gray-800 rounded-lg">
                  <input
                     type="range"
                     min="0"
                     max="1"
                     step="0.1"
                     value={volume}
                     onChange={handleVolumeChange}
                     className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer music-player-slider"
                   />
                </div>
              )}
            </div>

          

           
          </div>
        </div>
      </div>

      
    </div>
  );
}
