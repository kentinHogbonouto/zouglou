'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ApiSong } from '@/shared/types/api';

interface MusicPlayerState {
  currentTrack: ApiSong | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: ApiSong[];
  currentIndex: number;
}

export function useMusicPlayer() {
  const [state, setState] = useState<MusicPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    queue: [],
    currentIndex: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = useCallback((track: ApiSong) => {
    if (!audioRef.current) return;

    setState(prev => ({
      ...prev,
      currentTrack: track,
      isPlaying: false,
      currentTime: 0,
    }));

    audioRef.current.src = track.audio_file;
    audioRef.current.load();
    
    audioRef.current.play().then(() => {
      setState(prev => ({ ...prev, isPlaying: true }));
    }).catch((error) => {
      console.error('Erreur lors de la lecture:', error);
      setState(prev => ({ ...prev, isPlaying: false }));
    });
  }, []);

  const handleNext = useCallback(() => {
    if (state.queue.length === 0 || state.currentIndex >= state.queue.length - 1) {
      // Fin de la queue, arrêter la lecture
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    const nextIndex = state.currentIndex + 1;
    setState(prev => ({ ...prev, currentIndex: nextIndex }));
    playTrack(state.queue[nextIndex]);
  }, [state.queue, state.currentIndex, playTrack]);

  // Initialiser l'audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = state.volume;

      // Événements audio
      audioRef.current.addEventListener('loadedmetadata', () => {
        setState(prev => ({ ...prev, duration: audioRef.current?.duration || 0 }));
      });

      audioRef.current.addEventListener('timeupdate', () => {
        setState(prev => ({ ...prev, currentTime: audioRef.current?.currentTime || 0 }));
      });

      audioRef.current.addEventListener('ended', () => {
        handleNext();
      });

      audioRef.current.addEventListener('error', (e) => {
        console.error('Erreur audio:', e);
        setState(prev => ({ ...prev, isPlaying: false }));
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [state.volume, state.currentTrack, state.queue, state.currentIndex, state.isPlaying, state.currentTime, state.duration, handleNext]);

  // Sauvegarder l'état dans localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('musicPlayerState', JSON.stringify({
        currentTrack: state.currentTrack,
        volume: state.volume,
        queue: state.queue,
        currentIndex: state.currentIndex,
      }));
    }
  }, [state.currentTrack, state.volume, state.queue, state.currentIndex]);

  // Charger l'état depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('musicPlayerState');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setState(prev => ({
            ...prev,
            currentTrack: parsed.currentTrack,
            volume: parsed.volume,
            queue: parsed.queue || [],
            currentIndex: parsed.currentIndex || 0,
          }));
        } catch (error) {
          console.error('Erreur lors du chargement de l\'état du lecteur:', error);
        }
      }
    }
  }, []);

  const playQueue = (tracks: ApiSong[], startIndex: number = 0) => {
    setState(prev => ({
      ...prev,
      queue: tracks,
      currentIndex: startIndex,
    }));

    if (tracks.length > 0) {
      playTrack(tracks[startIndex]);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !state.currentTrack) return;

    if (state.isPlaying) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    } else {
      audioRef.current.play().then(() => {
        setState(prev => ({ ...prev, isPlaying: true }));
      }).catch((error) => {
        console.error('Erreur lors de la lecture:', error);
      });
    }
  };

  const handlePrevious = () => {
    if (state.queue.length === 0 || state.currentIndex <= 0) {
      // Début de la queue, recommencer la piste actuelle
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      return;
    }

    const prevIndex = state.currentIndex - 1;
    setState(prev => ({ ...prev, currentIndex: prevIndex }));
    playTrack(state.queue[prevIndex]);
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = time;
    setState(prev => ({ ...prev, currentTime: time }));
  };

  const setVolume = (volume: number) => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume;
    setState(prev => ({ ...prev, volume }));
  };

  const addToQueue = (track: ApiSong) => {
    setState(prev => ({
      ...prev,
      queue: [...prev.queue, track],
    }));
  };

  const removeFromQueue = (index: number) => {
    setState(prev => ({
      ...prev,
      queue: prev.queue.filter((_, i) => i !== index),
    }));
  };

  const clearQueue = () => {
    setState(prev => ({
      ...prev,
      queue: [],
      currentIndex: 0,
    }));
  };

  return {
    // État
    currentTrack: state.currentTrack,
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    volume: state.volume,
    queue: state.queue,
    currentIndex: state.currentIndex,

    // Actions
    playTrack,
    playQueue,
    togglePlayPause,
    handleNext,
    handlePrevious,
    seek,
    setVolume,
    addToQueue,
    removeFromQueue,
    clearQueue,
  };
}
