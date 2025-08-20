'use client';

import React, { useState } from 'react';
import { ApiSong } from '@/shared/types/api';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Heart, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  List, 
  X, 
  Maximize2,
  Minimize2
} from 'lucide-react';
import Image from 'next/image';
interface ModernMusicPlayerProps {
  currentTrack: ApiSong | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onClose: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleLike: () => void;
  onToggleFullscreen: () => void;
  onToggleQueue: () => void;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffled: boolean;
  repeatMode: 'none' | 'all' | 'one';
  isLiked: boolean;
  isFullscreen: boolean;
  showQueue: boolean;
}

export function ModernMusicPlayer({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onClose,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLike,
  onToggleFullscreen,
  onToggleQueue,
  currentTime,
  duration,
  volume,
  isShuffled,
  repeatMode,
  isLiked,
  isFullscreen,
  showQueue
}: ModernMusicPlayerProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

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

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return <Repeat1 className="w-5 h-5" />;
      case 'all':
        return <Repeat className="w-5 h-5" />;
      default:
        return <Repeat className="w-5 h-5" />;
    }
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200/60 z-50 transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-24'
    }`}>
      <div className="flex items-center justify-between px-6 py-4 h-full">
        {/* Informations de la piste (gauche) */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative group">
            <Image
              src={currentTrack.cover || '/images/cover_default.jpg'}
              alt={currentTrack.title}
              className="w-12 h-12 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-all duration-300"
              width={400}
              height={400}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-all duration-300 flex items-center justify-center">
              <button
                onClick={onPlayPause}
                className="opacity-0 group-hover:opacity-100 bg-white/90 p-1.5 rounded-full shadow-lg transition-all duration-300 hover:bg-white hover:scale-110"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-slate-800" />
                ) : (
                  <Play className="w-4 h-4 text-slate-800 ml-0.5" />
                )}
              </button>
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="text-slate-800 text-sm font-medium truncate group-hover:text-slate-900 transition-colors">
              {currentTrack.title}
            </h3>
            <p className="text-slate-500 text-xs truncate">{currentTrack.artist.stage_name}</p>
          </div>
        </div>

        {/* Contrôles de lecture (centre) */}
        <div className="flex items-center gap-4">
          {/* Bouton Shuffle */}
          <button
            onClick={onToggleShuffle}
            className={`p-2 rounded-full transition-all duration-200 ${
              isShuffled 
                ? 'text-[#005929] bg-[#005929]/10 hover:bg-[#005929]/20' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Bouton Précédent */}
          <button
            onClick={onPrevious}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Bouton Play/Pause */}
          <button
            onClick={onPlayPause}
            className="bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white rounded-full p-3 hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>

          {/* Bouton Suivant */}
          <button
            onClick={onNext}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* Bouton Repeat */}
          <button
            onClick={onToggleRepeat}
            className={`p-2 rounded-full transition-all duration-200 ${
              repeatMode !== 'none' 
                ? 'text-[#005929] bg-[#005929]/10 hover:bg-[#005929]/20' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            {getRepeatIcon()}
          </button>
        </div>

        {/* Barre de progression et contrôles (droite) */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Barre de progression */}
          <div className="flex items-center gap-3 min-w-0 flex-1 max-w-md">
            <span className="text-slate-400 text-xs whitespace-nowrap">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div 
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#005929] to-[#FE5200] rounded-lg pointer-events-none"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="text-slate-400 text-xs whitespace-nowrap">
              {formatTime(duration)}
            </span>
          </div>

          {/* Contrôles supplémentaires */}
          <div className="flex items-center gap-2">
            {/* Volume */}
            <div className="relative">
              <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              {showVolumeSlider && (
                <div className="absolute bottom-full right-0 mb-2 p-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                </div>
              )}
            </div>

            {/* File d'attente */}
            <button 
              onClick={onToggleQueue}
              className={`p-2 rounded-full transition-all duration-200 ${
                showQueue 
                  ? 'text-[#005929] bg-[#005929]/10 hover:bg-[#005929]/20' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>

            {/* Plein écran */}
            <button 
              onClick={onToggleFullscreen}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Like */}
            <button
              onClick={onToggleLike}
              className={`p-2 rounded-full transition-all duration-200 ${
                isLiked 
                  ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                  : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              {isLiked ? (
                <Heart className="w-4 h-4 fill-current" />
              ) : (
                <Heart className="w-4 h-4" />
              )}
            </button>

            {/* Minimiser/Maximiser */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </button>

            {/* Fermer */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Styles CSS pour les sliders */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(135deg, #005929, #FE5200);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(135deg, #005929, #FE5200);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}

