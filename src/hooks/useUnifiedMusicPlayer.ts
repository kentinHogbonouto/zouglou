'use client';

import { useUnifiedPlayerContext } from '@/components/providers/UnifiedPlayerProvider';

export function useUnifiedMusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    trackQueue,
    currentIndex,
    isShuffleOn,
    repeatMode,
    favorites,
    shuffledPlaylist,
    playTrack,
    playTrackQueue,
    togglePlayPause,
    handleNext,
    handlePrevious,
    seek,
    setVolume,
    toggleMute,
    stop,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    selectTrack,
    addTrackToQueue,
    removeTrackFromQueue,
    clearTrackQueue,
    formatTime,
  } = useUnifiedPlayerContext();

  // Calculer si les boutons next/previous doivent être désactivés
  const hasNext = trackQueue.length > 0 && (
    repeatMode === 'all' || 
    isShuffleOn || 
    currentIndex < trackQueue.length - 1
  );

  const hasPrevious = trackQueue.length > 0 && (
    repeatMode === 'all' || 
    isShuffleOn || 
    currentIndex > 0
  );

  return {
    // État
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    queue: trackQueue,
    currentIndex,
    isShuffleOn,
    repeatMode,
    favorites,
    shuffledPlaylist,
    isLoading: false,

    // Navigation
    hasNext,
    hasPrevious,

    // Actions
    playTrack,
    playTrackQueue,
    playQueue: playTrackQueue,
    togglePlayPause,
    handleNext,
    handlePrevious,
    seek,
    setVolume,
    toggleMute,
    stop,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    selectTrack,
    addToQueue: addTrackToQueue,
    removeFromQueue: removeTrackFromQueue,
    clearQueue: clearTrackQueue,
    formatTime,
  };
}
