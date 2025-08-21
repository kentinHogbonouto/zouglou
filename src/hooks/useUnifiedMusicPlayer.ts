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
    isShuffleOn,
    repeatMode,
    playTrack,
    playTrackQueue,
    togglePlayPause,
    handleNext,
    handlePrevious,
    seek,
    setVolume,
    stop,
    toggleShuffle,
    toggleRepeat,
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
    isShuffleOn,
    repeatMode,
    isLoading: false, // Ajout de isLoading

    // Actions
    playTrack,
    playTrackQueue,
    playQueue: playTrackQueue,
    togglePlayPause,
    handleNext,
    handlePrevious,
    seek,
    setVolume,
    stop,
    toggleShuffle,
    toggleRepeat,
    addToQueue: addTrackToQueue,
    removeFromQueue: removeTrackFromQueue,
    clearQueue: clearTrackQueue,
  };
}
