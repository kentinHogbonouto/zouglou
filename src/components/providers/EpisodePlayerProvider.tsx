'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useUnifiedEpisodePlayer } from '@/hooks/useUnifiedEpisodePlayer';
import { ApiPodcastEpisode } from '@/shared/types/api';

interface EpisodePlayerContextType {
  currentEpisode: ApiPodcastEpisode | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: ApiPodcastEpisode[];
  currentIndex: number;
  playEpisode: (episode: ApiPodcastEpisode) => void;
  playQueue: (episodes: ApiPodcastEpisode[], startIndex?: number) => void;
  togglePlayPause: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  addToQueue: (episode: ApiPodcastEpisode) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  stop: () => void;
}

const EpisodePlayerContext = createContext<EpisodePlayerContextType | undefined>(undefined);

interface EpisodePlayerProviderProps {
  children: ReactNode;
}

export function EpisodePlayerProvider({ children }: EpisodePlayerProviderProps) {
  const episodePlayer = useUnifiedEpisodePlayer();

  return (
    <EpisodePlayerContext.Provider value={episodePlayer}>
      {children}
    </EpisodePlayerContext.Provider>
  );
}

export function useEpisodePlayerContext() {
  const context = useContext(EpisodePlayerContext);
  if (context === undefined) {
    throw new Error('useEpisodePlayerContext must be used within an EpisodePlayerProvider');
  }
  return context;
}
