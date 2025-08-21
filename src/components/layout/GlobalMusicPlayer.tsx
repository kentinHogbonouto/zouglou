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
    isShuffleOn,
    repeatMode,
    togglePlayPause,
    handleNext,
    handlePrevious,
    seek,
    setVolume,
    stop,
    toggleShuffle,
    toggleRepeat,
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
      onClose={stop}
      onShuffle={toggleShuffle}
      onRepeat={toggleRepeat}
      isShuffleOn={isShuffleOn}
      repeatMode={repeatMode}
      currentTime={currentTime}
      duration={duration}
      volume={volume}
    />
  );
}
