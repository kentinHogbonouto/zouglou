'use client';

import React from 'react';
import { useUnifiedPlayerContext } from '@/components/providers/UnifiedPlayerProvider';
import { MusicPlayer } from '@/components/ui/MusicPlayer';
import { EpisodePlayer } from '@/components/ui/EpisodePlayer';

export function UnifiedPlayer() {
  const {
    currentTrack,
    currentEpisode,
    currentMediaType,
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
  } = useUnifiedPlayerContext();

  if (!currentMediaType || (!currentTrack && !currentEpisode)) {
    return null;
  }

  if (currentMediaType === 'track' && currentTrack) {
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

  if (currentMediaType === 'episode' && currentEpisode) {
    return (
      <EpisodePlayer
        currentEpisode={currentEpisode}
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

  return null;
}
