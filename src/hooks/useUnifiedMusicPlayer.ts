'use client';

import { useUnifiedPlayerContext } from '@/components/providers/UnifiedPlayerProvider';

export function useUnifiedMusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    trackQueue,
    currentIndex,
    playTrack,
    playTrackQueue,
    togglePlayPause,
    handleNext,
    handlePrevious,
    seek,
    setVolume,
    addTrackToQueue,
    removeTrackFromQueue,
    clearTrackQueue,
  } = useUnifiedPlayerContext();

  return {
    // État
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue: trackQueue,
    currentIndex,

    // Actions
    playTrack,
    playQueue: playTrackQueue,
    togglePlayPause,
    handleNext,
    handlePrevious,
    seek,
    setVolume,
    addToQueue: addTrackToQueue,
    removeFromQueue: removeTrackFromQueue,
    clearQueue: clearTrackQueue,
  };
}
