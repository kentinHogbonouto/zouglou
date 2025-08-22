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
  isMuted: boolean;
  trackQueue: ApiSong[];
  episodeQueue: ApiPodcastEpisode[];
  currentIndex: number;
  isShuffleOn: boolean;
  repeatMode: 'none' | 'one' | 'all';
  favorites: Set<string>;
  shuffledPlaylist: number[];
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
  isMuted: boolean;
  trackQueue: ApiSong[];
  episodeQueue: ApiPodcastEpisode[];
  currentIndex: number;
  isShuffleOn: boolean;
  repeatMode: 'none' | 'one' | 'all';
  favorites: Set<string>;
  shuffledPlaylist: number[];

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
  toggleMute: () => void;
  stop: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFavorite: (trackId: string) => void;
  selectTrack: (index: number) => void;
  formatTime: (time: number) => string;
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
    isMuted: false,
    trackQueue: [],
    episodeQueue: [],
    currentIndex: 0,
    isShuffleOn: false,
    repeatMode: 'none',
    favorites: new Set(),
    shuffledPlaylist: [],
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isTransitioningRef = useRef(false);

  // Fonction utilitaire pour formater le temps
  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Fonction pour mélanger un tableau
  const shuffleArray = (array: number[]): number[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fonction pour arrêter complètement l'audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
  }, []);

  // Fonction pour charger et jouer un nouveau média
  const loadAndPlayMedia = useCallback(async (src: string) => {
    if (!audioRef.current) return false;

    try {
      // Arrêter complètement l'audio actuel
      stopAudio();
      
      // Réinitialiser les états
      setState(prev => ({
        ...prev,
        currentTime: 0,
        duration: 0,
        isPlaying: false
      }));

      // Charger le nouveau fichier
      audioRef.current.src = src;
      audioRef.current.load();

      // Attendre que les métadonnées soient chargées
      await new Promise((resolve, reject) => {
        if (!audioRef.current) return reject(new Error('Audio element not found'));
        
        const onLoadedMetadata = () => {
          audioRef.current?.removeEventListener('loadedmetadata', onLoadedMetadata);
          audioRef.current?.removeEventListener('error', onError);
          resolve(true);
        };
        
        const onError = () => {
          audioRef.current?.removeEventListener('loadedmetadata', onLoadedMetadata);
          audioRef.current?.removeEventListener('error', onError);
          reject(new Error('Failed to load audio'));
        };

        audioRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
        audioRef.current.addEventListener('error', onError);
      });

      // Jouer le fichier
      await audioRef.current.play();
      
      setState(prev => ({ ...prev, isPlaying: true }));
      return true;
    } catch (error) {
      console.error('Erreur lors du chargement/lecture:', error);
      setState(prev => ({ ...prev, isPlaying: false }));
      return false;
    }
  }, [stopAudio]);

  const playTrack = async (track: ApiSong) => {
    if (!audioRef.current) return;

    // Si c'est la même piste, toggle play/pause
    if (state.currentTrack?.id === track.id) {
      if (state.isPlaying) {
        audioRef.current.pause();
        setState(prev => ({ ...prev, isPlaying: false }));
      } else {
        audioRef.current.play();
        setState(prev => ({ ...prev, isPlaying: true }));
      }
      return;
    }

    // Arrêter l'audio actuel
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    
    // Mettre à jour l'état avec la nouvelle piste
    setState(prev => ({
      ...prev,
      currentTrack: track,
      currentEpisode: null,
      currentMediaType: 'track',
      currentTime: 0,
      duration: 0,
    }));

    // Charger et jouer la nouvelle piste
    audioRef.current.src = track.audio_file;
    audioRef.current.load();
    audioRef.current.play().then(() => {
      setState(prev => ({ ...prev, isPlaying: true }));
    }).catch((error) => {
      console.error('Erreur de lecture:', error);
      setState(prev => ({ ...prev, isPlaying: false }));
    });
  };

  const playEpisode = useCallback(async (episode: ApiPodcastEpisode) => {
    if (!audioRef.current) return;

    // Si c'est le même épisode, toggle play/pause
    if (state.currentEpisode?.id === episode.id && !isTransitioningRef.current) {
      if (state.isPlaying) {
        audioRef.current.pause();
        setState(prev => ({ ...prev, isPlaying: false }));
      } else {
        try {
          await audioRef.current.play();
          setState(prev => ({ ...prev, isPlaying: true }));
        } catch (error) {
          console.error('Erreur de lecture:', error);
          setState(prev => ({ ...prev, isPlaying: false }));
        }
      }
      return;
    }

    isTransitioningRef.current = true;

    // Mettre à jour l'état avec le nouvel épisode
    setState(prev => ({
      ...prev,
      currentEpisode: episode,
      currentTrack: null,
      currentMediaType: 'episode',
    }));

    // Charger et jouer le nouvel épisode
    await loadAndPlayMedia(episode.file);
    


    isTransitioningRef.current = false;
  }, [state.currentEpisode?.id, state.isPlaying, loadAndPlayMedia]);

  const togglePlayPause = useCallback(async () => {
    if (!audioRef.current || (!state.currentTrack && !state.currentEpisode)) {
      return;
    }

    try {
      if (state.isPlaying) {
        audioRef.current.pause();
        setState(prev => ({ ...prev, isPlaying: false }));
      } else {
        await audioRef.current.play();
        setState(prev => ({ ...prev, isPlaying: true }));
      }
    } catch (error) {
      console.error('Erreur toggle play/pause:', error);
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, [state.isPlaying, state.currentTrack, state.currentEpisode]);

  const selectTrack = useCallback(async (index: number) => {
    if (state.currentMediaType === 'track' && state.trackQueue.length > 0 && index < state.trackQueue.length) {
      const track = state.trackQueue[index];
      setState(prev => ({ ...prev, currentIndex: index }));
      await playTrack(track);
    } else if (state.currentMediaType === 'episode' && state.episodeQueue.length > 0 && index < state.episodeQueue.length) {
      const episode = state.episodeQueue[index];
      setState(prev => ({ ...prev, currentIndex: index }));
      await playEpisode(episode);
    }
  }, [state.currentMediaType, state.trackQueue, state.episodeQueue, playTrack, playEpisode]);

  const handleNext = () => {
    if (state.currentMediaType === 'track' && state.trackQueue.length > 0) {
      let nextIndex;
      
      if (state.isShuffleOn) {
        const currentShuffleIndex = state.shuffledPlaylist.indexOf(state.currentIndex);
        const nextShuffleIndex = (currentShuffleIndex + 1) % state.shuffledPlaylist.length;
        nextIndex = state.shuffledPlaylist[nextShuffleIndex];
      } else {
        nextIndex = (state.currentIndex + 1) % state.trackQueue.length;
      }
      
      // Si on est à la fin et que le mode répétition est 'none', arrêter
      if (state.repeatMode === 'none' && !state.isShuffleOn && state.currentIndex === state.trackQueue.length - 1) {
        setState(prev => ({ ...prev, isPlaying: false }));
        return;
      }
      
      const track = state.trackQueue[nextIndex];
      setState(prev => ({ ...prev, currentIndex: nextIndex }));
      playTrack(track);
      
    } else if (state.currentMediaType === 'episode' && state.episodeQueue.length > 0) {
      const nextIndex = (state.currentIndex + 1) % state.episodeQueue.length;
      
      if (state.repeatMode === 'none' && state.currentIndex === state.episodeQueue.length - 1) {
        setState(prev => ({ ...prev, isPlaying: false }));
        return;
      }
      
      const episode = state.episodeQueue[nextIndex];
      setState(prev => ({ ...prev, currentIndex: nextIndex }));
      playEpisode(episode);
    }
  };

  const handlePrevious = () => {
    if (state.currentMediaType === 'track' && state.trackQueue.length > 0) {
      let prevIndex;
      
      if (state.isShuffleOn) {
        const currentShuffleIndex = state.shuffledPlaylist.indexOf(state.currentIndex);
        const prevShuffleIndex = currentShuffleIndex === 0 ? state.shuffledPlaylist.length - 1 : currentShuffleIndex - 1;
        prevIndex = state.shuffledPlaylist[prevShuffleIndex];
      } else {
        prevIndex = state.currentIndex === 0 ? state.trackQueue.length - 1 : state.currentIndex - 1;
      }
      
      const track = state.trackQueue[prevIndex];
      setState(prev => ({ ...prev, currentIndex: prevIndex }));
      playTrack(track);
      
    } else if (state.currentMediaType === 'episode' && state.episodeQueue.length > 0) {
      const prevIndex = state.currentIndex === 0 ? state.episodeQueue.length - 1 : state.currentIndex - 1;
      
      const episode = state.episodeQueue[prevIndex];
      setState(prev => ({ ...prev, currentIndex: prevIndex }));
      playEpisode(episode);
    }
  };

  const toggleShuffle = useCallback(() => {
    setState(prev => {
      if (!prev.isShuffleOn) {
        // Créer un nouveau playlist mélangé
        const newShuffled = shuffleArray([...Array(prev.trackQueue.length).keys()]);
        return { ...prev, shuffledPlaylist: newShuffled, isShuffleOn: true };
      } else {
        return { ...prev, isShuffleOn: false };
      }
    });
  }, []);

  const toggleRepeat = useCallback(() => {
    setState(prev => {
      const modes: ('none' | 'one' | 'all')[] = ['none', 'all', 'one'];
      const currentIndex = modes.indexOf(prev.repeatMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      return { ...prev, repeatMode: modes[nextIndex] };
    });
  }, []);

  const toggleMute = useCallback(() => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const toggleFavorite = useCallback((trackId: string) => {
    setState(prev => {
      const newFavorites = new Set(prev.favorites);
      if (newFavorites.has(trackId)) {
        newFavorites.delete(trackId);
      } else {
        newFavorites.add(trackId);
      }
      return { ...prev, favorites: newFavorites };
    });
  }, []);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    setState(prev => ({ ...prev, volume, isMuted: false }));
  }, []);

  const stop = useCallback(() => {
    stopAudio();
    setState(prev => ({
      ...prev,
      currentTrack: null,
      currentEpisode: null,
      currentMediaType: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    }));
  }, [stopAudio]);

  // Initialiser l'audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = state.volume;

      // Événements audio
      const handleLoadedMetadata = () => {
        const duration = audioRef.current?.duration || 0;
        setState(prev => ({ ...prev, duration }));
      };

      const handleTimeUpdate = () => {
        const currentTime = audioRef.current?.currentTime || 0;
        setState(prev => ({ ...prev, currentTime }));
      };

      const handleEnded = () => {
        
        if (state.repeatMode === 'one') {
          // Répéter la piste actuelle
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }
        } else {
          // Passer à la piste suivante
          handleNext();
        }
      };

      const handlePause = () => {
        setState(prev => ({ ...prev, isPlaying: false }));
      };

      const handlePlay = () => {
        setState(prev => ({ ...prev, isPlaying: true }));
      };

      const handleError = (e: Event) => {
        console.error('Erreur audio:', e);
        setState(prev => ({ ...prev, isPlaying: false }));
      };

      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('pause', handlePause);
      audioRef.current.addEventListener('play', handlePlay);
      audioRef.current.addEventListener('error', handleError);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('ended', handleEnded);
          audioRef.current.removeEventListener('pause', handlePause);
          audioRef.current.removeEventListener('play', handlePlay);
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current = null;
        }
      };
    }
  }, [state.repeatMode]);

  // Mise à jour du volume et du mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? 0 : state.volume;
    }
  }, [state.volume, state.isMuted]);

  // Gestion des queues
  const playTrackQueue = useCallback((tracks: ApiSong[], startIndex: number = 0) => {
    const shuffledPlaylist = shuffleArray([...Array(tracks.length).keys()]);
    setState(prev => ({
      ...prev,
      trackQueue: tracks,
      currentIndex: startIndex,
      shuffledPlaylist,
    }));

    if (tracks.length > 0) {
      playTrack(tracks[startIndex]);
    }
  }, [playTrack]);

  const playEpisodeQueue = useCallback((episodes: ApiPodcastEpisode[], startIndex: number = 0) => {
    setState(prev => ({
      ...prev,
      episodeQueue: episodes,
      currentIndex: startIndex,
    }));

    if (episodes.length > 0) {
      playEpisode(episodes[startIndex]);
    }
  }, [playEpisode]);

  const addTrackToQueue = useCallback((track: ApiSong) => {
    setState(prev => ({
      ...prev,
      trackQueue: [...prev.trackQueue, track],
    }));
  }, []);

  const removeTrackFromQueue = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      trackQueue: prev.trackQueue.filter((_, i) => i !== index),
    }));
  }, []);

  const clearTrackQueue = useCallback(() => {
    setState(prev => ({
      ...prev,
      trackQueue: [],
      currentIndex: 0,
    }));
  }, []);

  const addEpisodeToQueue = useCallback((episode: ApiPodcastEpisode) => {
    setState(prev => ({
      ...prev,
      episodeQueue: [...prev.episodeQueue, episode],
    }));
  }, []);

  const removeEpisodeFromQueue = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      episodeQueue: prev.episodeQueue.filter((_, i) => i !== index),
    }));
  }, []);

  const clearEpisodeQueue = useCallback(() => {
    setState(prev => ({
      ...prev,
      episodeQueue: [],
      currentIndex: 0,
    }));
  }, []);

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
      isMuted: state.isMuted,
      trackQueue: state.trackQueue,
      episodeQueue: state.episodeQueue,
      currentIndex: state.currentIndex,
      isShuffleOn: state.isShuffleOn,
      repeatMode: state.repeatMode,
      favorites: state.favorites,
      shuffledPlaylist: state.shuffledPlaylist,

      // Actions pour les tracks
      playTrack,
      playTrackQueue,
      addTrackToQueue,
      removeTrackFromQueue,
      clearTrackQueue,

      // Actions pour les épisodes
      playEpisode,
      playEpisodeQueue,
      addEpisodeToQueue,
      removeEpisodeFromQueue,
      clearEpisodeQueue,

      // Actions communes
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
      formatTime,
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