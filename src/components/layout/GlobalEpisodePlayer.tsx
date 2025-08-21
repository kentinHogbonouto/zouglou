'use client';

import React from 'react';
import { EpisodePlayer } from '@/components/ui/EpisodePlayer';
import { useEpisodePlayerContext } from '@/components/providers/EpisodePlayerProvider';

export function GlobalEpisodePlayer() {
  const {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    handleNext,
    handlePrevious,
    seek,
    setVolume,
    stop,
  } = useEpisodePlayerContext();

  return (
    <EpisodePlayer
      currentEpisode={currentEpisode}
      isPlaying={isPlaying}
      onPlayPause={togglePlayPause}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSeek={seek}
      onVolumeChange={setVolume}
      onClose={stop}
      currentTime={currentTime}
      duration={duration}
      volume={volume}
    />
  );
}
