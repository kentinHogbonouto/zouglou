'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ApiPodcastEpisode } from '@/shared/types/api';

interface EpisodePlayerState {
  currentEpisode: ApiPodcastEpisode | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: ApiPodcastEpisode[];
  currentIndex: number;
}

export function useEpisodePlayer() {
  const [state, setState] = useState<EpisodePlayerState>({
    currentEpisode: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    queue: [],
    currentIndex: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playEpisode = useCallback((episode: ApiPodcastEpisode) => {
    if (!audioRef.current) return;

    setState(prev => ({
      ...prev,
      currentEpisode: episode,
      isPlaying: false,
      currentTime: 0,
    }));

    audioRef.current.src = episode.file;
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
      setState(prev => ({ ...prev, isPlaying: false }));
      return;
    }

    const nextIndex = state.currentIndex + 1;
    setState(prev => ({ ...prev, currentIndex: nextIndex }));
    playEpisode(state.queue[nextIndex]);
  }, [state.queue, state.currentIndex, playEpisode]);

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
  }, [state.volume, state.currentEpisode, state.queue, state.currentIndex, state.isPlaying, state.currentTime, state.duration, handleNext]);

  // Sauvegarder l'état dans localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('episodePlayerState', JSON.stringify({
        currentEpisode: state.currentEpisode,
        volume: state.volume,
        queue: state.queue,
        currentIndex: state.currentIndex,
      }));
    }
  }, [state.currentEpisode, state.volume, state.queue, state.currentIndex]);

  // Charger l'état depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('episodePlayerState');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setState(prev => ({
            ...prev,
            currentEpisode: parsed.currentEpisode,
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

  const playQueue = (episodes: ApiPodcastEpisode[], startIndex: number = 0) => {
    setState(prev => ({
      ...prev,
      queue: episodes,
      currentIndex: startIndex,
    }));

    if (episodes.length > 0) {
      playEpisode(episodes[startIndex]);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !state.currentEpisode) return;

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
      return;
    }

    const prevIndex = state.currentIndex - 1;
    setState(prev => ({ ...prev, currentIndex: prevIndex }));
    playEpisode(state.queue[prevIndex]);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setState(prev => ({ ...prev, volume }));
    }
  };

  const addToQueue = (episode: ApiPodcastEpisode) => {
    setState(prev => ({
      ...prev,
      queue: [...prev.queue, episode],
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
    currentEpisode: state.currentEpisode,
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    volume: state.volume,
    queue: state.queue,
    currentIndex: state.currentIndex,
    playEpisode,
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
