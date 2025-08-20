'use client';

import { useUnifiedPlayerContext } from '@/components/providers/UnifiedPlayerProvider';

export function useUnifiedEpisodePlayer() {
  const {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    volume,
    episodeQueue,
    currentIndex,
    playEpisode,
    playEpisodeQueue,
    togglePlayPause,
    handleNext,
    handlePrevious,
    seek,
    setVolume,
    addEpisodeToQueue,
    removeEpisodeFromQueue,
    clearEpisodeQueue,
  } = useUnifiedPlayerContext();

  return {
    // État
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue: episodeQueue,
    currentIndex,

    // Actions
    playEpisode,
    playQueue: playEpisodeQueue,
    togglePlayPause,
    handleNext,
    handlePrevious,
    seek,
    setVolume,
    addToQueue: addEpisodeToQueue,
    removeFromQueue: removeEpisodeFromQueue,
    clearQueue: clearEpisodeQueue,
  };
}
