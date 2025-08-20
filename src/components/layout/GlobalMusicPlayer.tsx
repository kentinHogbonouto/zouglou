'use client';

import React from 'react';
import { MusicPlayer } from '@/components/ui/MusicPlayer';
import { useMusicPlayerContext } from '@/components/providers/MusicPlayerProvider';

export function GlobalMusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    handleNext,
    handlePrevious,
    seek,
    setVolume,
  } = useMusicPlayerContext();

  return (
    <MusicPlayer
      currentTrack={currentTrack}
      isPlaying={isPlaying}
      onPlayPause={togglePlayPause}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSeek={seek}
      onVolumeChange={setVolume}
      currentTime={currentTime}
      duration={duration}
      volume={volume}
    />
  );
}
