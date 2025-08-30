'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUnifiedPlayerContext } from '@/components/providers/UnifiedPlayerProvider';

interface UseAdvertisementAudioProps {
  audioUrl: string | null;
  onError?: (error: string) => void;
}

export function useAdvertisementAudio({ audioUrl, onError }: UseAdvertisementAudioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Accéder au contexte du lecteur unifié
  const { stop: stopUnifiedPlayer, isPlaying: isUnifiedPlaying } = useUnifiedPlayerContext();

  // Nettoyer l'URL audio
  const cleanAudioUrl = useCallback((url: string): string => {
    // Supprimer les guillemets simples qui causent des problèmes
    const cleanUrl = url
    
    // Encoder l'URL pour gérer les caractères spéciaux
    try {
      const urlObj = new URL(cleanUrl);
      return urlObj.toString();
    } catch {
      console.error('URL audio invalide:', cleanUrl);
      throw new Error('URL audio invalide');
    }
  }, []);

  // Initialiser l'élément audio
  useEffect(() => {
    if (!audioUrl) {
      setError(null);
      return;
    }

    try {
      const cleanUrl = cleanAudioUrl(audioUrl);
      console.log('URL audio nettoyée:', cleanUrl);
      
      const audio = new Audio(cleanUrl);
      
      // Gestionnaire d'événements pour la fin de lecture
      const handleEnded = () => {
        setIsPlaying(false);
        console.log('Audio publicité terminé');
      };
      
      // Gestionnaire d'événements pour les erreurs
      const handleError = (e: Event) => {
        console.error('Erreur audio publicité:', e);
        setIsPlaying(false);
        const errorMessage = 'Erreur lors du chargement de l\'audio';
        setError(errorMessage);
        onError?.(errorMessage);
      };
      
      // Gestionnaire d'événements pour le chargement
      const handleLoadedData = () => {
        console.log('Audio publicité chargé avec succès');
        setError(null);
      };

      // Gestionnaire d'événements pour le début du chargement
      const handleLoadStart = () => {
        console.log('Début du chargement audio publicité');
        setError(null);
      };

      // Gestionnaire d'événements pour la pause
      const handlePause = () => {
        setIsPlaying(false);
      };

      // Gestionnaire d'événements pour la lecture
      const handlePlay = () => {
        setIsPlaying(true);
      };
      
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('loadeddata', handleLoadedData);
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('play', handlePlay);
      
      audioRef.current = audio;
      
      return () => {
        audio.pause();
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('loadeddata', handleLoadedData);
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('play', handlePlay);
        audioRef.current = null;
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'initialisation audio';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [audioUrl, cleanAudioUrl, onError]);

  // Arrêter l'audio quand on quitte la page
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Fonction pour jouer/pause l'audio
  const toggleAudio = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      setIsLoading(true);
      setError(null);
      
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Arrêter le lecteur unifié avant de jouer l'audio publicité
        if (isUnifiedPlaying) {
          stopUnifiedPlayer();
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Erreur lors de la lecture audio publicité:', error);
      const errorMessage = 'Erreur lors de la lecture audio';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isPlaying, isUnifiedPlaying, stopUnifiedPlayer, onError]);

  // Fonction pour arrêter l'audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // Fonction pour reprendre l'audio
  const resumeAudio = useCallback(async () => {
    if (audioRef.current && !isPlaying) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Erreur lors de la reprise audio:', error);
      }
    }
  }, [isPlaying]);

  return {
    isPlaying,
    isLoading,
    error,
    toggleAudio,
    stopAudio,
    resumeAudio,
  };
}
