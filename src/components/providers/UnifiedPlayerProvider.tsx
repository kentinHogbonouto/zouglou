'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useRef, useCallback } from 'react';
import { ApiSong, ApiPodcastEpisode } from '@/shared/types/api';

type MediaType = 'track' | 'episode';

interface UnifiedPlayerState {
  currentTrack: ApiSong | null;
  currentEpisode: ApiPodcastEpisode | null;
  currentMediaType: MediaType | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  trackQueue: ApiSong[];
  episodeQueue: ApiPodcastEpisode[];
  currentIndex: number;
  isShuffleOn: boolean;
  repeatMode: 'none' | 'one' | 'all';
}

interface UnifiedPlayerContextType {
  // État
  currentTrack: ApiSong | null;
  currentEpisode: ApiPodcastEpisode | null;
  currentMediaType: MediaType | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  trackQueue: ApiSong[];
  episodeQueue: ApiPodcastEpisode[];
  currentIndex: number;
  isShuffleOn: boolean;
  repeatMode: 'none' | 'one' | 'all';

  // Actions pour les tracks
  playTrack: (track: ApiSong) => void;
  playTrackQueue: (tracks: ApiSong[], startIndex?: number) => void;
  addTrackToQueue: (track: ApiSong) => void;
  removeTrackFromQueue: (index: number) => void;
  clearTrackQueue: () => void;

  // Actions pour les épisodes
  playEpisode: (episode: ApiPodcastEpisode) => void;
  playEpisodeQueue: (episodes: ApiPodcastEpisode[], startIndex?: number) => void;
  addEpisodeToQueue: (episode: ApiPodcastEpisode) => void;
  removeEpisodeFromQueue: (index: number) => void;
  clearEpisodeQueue: () => void;

  // Actions communes
  togglePlayPause: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  stop: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const UnifiedPlayerContext = createContext<UnifiedPlayerContextType | undefined>(undefined);

interface UnifiedPlayerProviderProps {
  children: ReactNode;
}

export function UnifiedPlayerProvider({ children }: UnifiedPlayerProviderProps) {
  const [state, setState] = useState<UnifiedPlayerState>({
    currentTrack: null,
    currentEpisode: null,
    currentMediaType: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    trackQueue: [],
    episodeQueue: [],
    currentIndex: 0,
    isShuffleOn: false,
    repeatMode: 'none',
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Protection contre les lectures multiples
  const isPlayingRef = useRef(false);

  const playTrack = useCallback((track: ApiSong) => {
    
    if (!audioRef.current) {
      return;
    }

    // Protection contre les lectures multiples
    if (isPlayingRef.current) {
      return;
    }

    // Si c'est la même piste, toggle play/pause
    if (state.currentTrack?.id === track.id) {
      if (state.isPlaying) {
        audioRef.current.pause();
        setState(prev => ({ ...prev, isPlaying: false }));
      } else {
        audioRef.current.play().catch(() => {});
        setState(prev => ({ ...prev, isPlaying: true }));
      }
      return;
    }

    
    // Activer la protection
    isPlayingRef.current = true;
    
    // Arrêter complètement l'audio actuel (piste ou épisode)
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    
    // Mettre à jour l'état - arrêter TOUT et définir la nouvelle piste
    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      currentTrack: track,
      currentEpisode: null, // IMPORTANT: Arrêter l'épisode
      currentMediaType: 'track',
    }));

    // Charger et jouer la nouvelle piste
    audioRef.current.src = track.audio_file;
    audioRef.current.load();
    
    audioRef.current.play().then(() => {
      setState(prev => ({ ...prev, isPlaying: true }));
      isPlayingRef.current = false; // Libérer la protection
    }).catch((error) => {
      console.error('Erreur de lecture:', error);
      setState(prev => ({ ...prev, isPlaying: false }));
      isPlayingRef.current = false; // Libérer la protection
    });
  }, [state.currentTrack?.id, state.isPlaying]);

  const playEpisode = useCallback((episode: ApiPodcastEpisode) => {
    
    if (!audioRef.current) {
      return;
    }

    // Si c'est le même épisode, toggle play/pause
    if (state.currentEpisode?.id === episode.id) {
      if (state.isPlaying) {
        audioRef.current.pause();
        setState(prev => ({ ...prev, isPlaying: false }));
      } else {
        audioRef.current.play().catch(() => {});
        setState(prev => ({ ...prev, isPlaying: true }));
      }
      return;
    }
    
    // ARRÊT FORCÉ ET IMMÉDIAT
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.src = ''; // VIDER complètement la source
    audioRef.current.load(); // Forcer le rechargement
    
    // Mettre à jour l'état immédiatement
    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      currentEpisode: episode,
      currentTrack: null, // IMPORTANT: Arrêter la piste
      currentMediaType: 'episode',
    }));

    // Attendre un peu pour s'assurer que l'arrêt est complet
    setTimeout(() => {
      if (audioRef.current) {
        
        // S'assurer que l'audio est bien arrêté
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        
        // Définir la nouvelle source
        audioRef.current.src = episode.file;
        audioRef.current.load();
        
        audioRef.current.play().then(() => {
          setState(prev => ({ ...prev, isPlaying: true }));
        }).catch((error) => {
          console.error('Erreur de lecture épisode:', error);
          setState(prev => ({ ...prev, isPlaying: false }));
        });
      }
    }, 100); // Délai pour s'assurer que l'arrêt est complet
  }, [state.currentEpisode?.id, state.isPlaying]);

  const togglePlayPause = () => {
    
    if (!audioRef.current || (!state.currentTrack && !state.currentEpisode)) {
      return;
    }

    if (state.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  };

  const seek = (time: number) => {
    
    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime = time;
    setState(prev => ({ ...prev, currentTime: time }))
  };

  const setVolume = (volume: number) => {
    
    if (!audioRef.current) {
      return;
    }

    audioRef.current.volume = volume;
    setState(prev => ({ ...prev, volume }));
  };

  const stop = () => {
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Libérer la protection
    isPlayingRef.current = false;
    
    setState(prev => ({
      ...prev,
      currentTrack: null,
      currentEpisode: null,
      currentMediaType: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    }));
    
  };

  // Initialiser l'audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = state.volume;

      // Événements audio
      audioRef.current.addEventListener('loadedmetadata', () => {
        const duration = audioRef.current?.duration || 0;
        setState(prev => ({ ...prev, duration }));
      });

      audioRef.current.addEventListener('timeupdate', () => {
        const currentTime = audioRef.current?.currentTime || 0;
        setState(prev => ({ ...prev, currentTime }));
      });

      audioRef.current.addEventListener('ended', () => {
        // handleNext(); // Removed as per edit hint
      });

      audioRef.current.addEventListener('pause', () => {
        setState(prev => ({ ...prev, isPlaying: false }));
      });

      audioRef.current.addEventListener('play', () => {
        setState(prev => ({ ...prev, isPlaying: true }));
      });

      audioRef.current.addEventListener('loadstart', () => {
        setState(prev => ({ ...prev, isPlaying: false }));
      });

      audioRef.current.addEventListener('canplay', () => {
      });

      audioRef.current.addEventListener('error', (e) => {
        console.error('Erreur audio:', e);
        setState(prev => ({ ...prev, isPlaying: false }));
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, [state.volume]); // Removed handleNext to dependency array

  // Sauvegarder l'état dans localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('unifiedPlayerState', JSON.stringify({
        currentTrack: state.currentTrack,
        currentEpisode: state.currentEpisode,
        currentMediaType: state.currentMediaType,
        volume: state.volume,
        trackQueue: state.trackQueue,
        episodeQueue: state.episodeQueue,
        currentIndex: state.currentIndex,
        isShuffleOn: state.isShuffleOn,
        repeatMode: state.repeatMode,
      }));
    }
  }, [state.currentTrack, state.currentEpisode, state.currentMediaType, state.volume, state.trackQueue, state.episodeQueue, state.currentIndex, state.isShuffleOn, state.repeatMode]);

  // Charger l'état depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('unifiedPlayerState');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setState(prev => ({
            ...prev,
            currentTrack: parsed.currentTrack,
            currentEpisode: parsed.currentEpisode,
            currentMediaType: parsed.currentMediaType,
            volume: parsed.volume,
            trackQueue: parsed.trackQueue || [],
            episodeQueue: parsed.episodeQueue || [],
            currentIndex: parsed.currentIndex || 0,
          }));
        } catch (error) {
          console.error('Erreur lors du chargement de l\'état du lecteur:', error);
        }
      }
    }
  }, []);

  const playTrackQueue = (tracks: ApiSong[], startIndex: number = 0) => {
    setState(prev => ({
      ...prev,
      trackQueue: tracks,
      currentIndex: startIndex,
    }));

    if (tracks.length > 0) {
      playTrack(tracks[startIndex]);
    }
  };

  const playEpisodeQueue = (episodes: ApiPodcastEpisode[], startIndex: number = 0) => {
    setState(prev => ({
      ...prev,
      episodeQueue: episodes,
      currentIndex: startIndex,
    }));

    if (episodes.length > 0) {
      playEpisode(episodes[startIndex]);
    }
  };

  // Removed handleNext, handlePrevious, seek, toggleShuffle, toggleRepeat as per edit hint

  return (
    <UnifiedPlayerContext.Provider value={{
      // État
      currentTrack: state.currentTrack,
      currentEpisode: state.currentEpisode,
      currentMediaType: state.currentMediaType,
      isPlaying: state.isPlaying,
      currentTime: state.currentTime,
      duration: state.duration,
      volume: state.volume,
      trackQueue: state.trackQueue,
      episodeQueue: state.episodeQueue,
      currentIndex: state.currentIndex,
      isShuffleOn: state.isShuffleOn,
      repeatMode: state.repeatMode,

      // Actions pour les tracks
      playTrack,
      playTrackQueue,
      addTrackToQueue: () => {}, // Placeholder
      removeTrackFromQueue: () => {}, // Placeholder
      clearTrackQueue: () => {}, // Placeholder

      // Actions pour les épisodes
      playEpisode,
      playEpisodeQueue,
      addEpisodeToQueue: () => {}, // Placeholder
      removeEpisodeFromQueue: () => {}, // Placeholder
      clearEpisodeQueue: () => {}, // Placeholder

      // Actions communes
      togglePlayPause,
      handleNext: () => {}, // Placeholder
      handlePrevious: () => {}, // Placeholder
      seek,
      setVolume,
      stop,
      toggleShuffle: () => {}, // Placeholder
      toggleRepeat: () => {}, // Placeholder
    }}>
      {children}
    </UnifiedPlayerContext.Provider>
  );
}

export function useUnifiedPlayerContext() {
  const context = useContext(UnifiedPlayerContext);
  if (context === undefined) {
    throw new Error('useUnifiedPlayerContext must be used within a UnifiedPlayerProvider');
  }
  return context;
}
