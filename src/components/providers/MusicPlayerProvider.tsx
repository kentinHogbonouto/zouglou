'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useUnifiedMusicPlayer } from '@/hooks/useUnifiedMusicPlayer';
import { ApiSong } from '@/shared/types/api';

interface MusicPlayerContextType {
  currentTrack: ApiSong | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: ApiSong[];
  currentIndex: number;
  playTrack: (track: ApiSong) => void;
  playQueue: (tracks: ApiSong[], startIndex?: number) => void;
  togglePlayPause: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  addToQueue: (track: ApiSong) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

interface MusicPlayerProviderProps {
  children: ReactNode;
}

export function MusicPlayerProvider({ children }: MusicPlayerProviderProps) {
  const musicPlayer = useUnifiedMusicPlayer();

  return (
    <MusicPlayerContext.Provider value={musicPlayer}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayerContext() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayerContext must be used within a MusicPlayerProvider');
  }
  return context;
}
