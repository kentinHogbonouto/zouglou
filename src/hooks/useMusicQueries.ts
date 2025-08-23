'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import {
  ApiSong,
  ApiAlbum,
  ApiPaginatedSongList,
  ApiPaginatedAlbumList,
  CreateSongData,
  UpdateSongData,
  CreateAlbumData,
  UpdateAlbumData,
  ApiCategory,
  ApiPaginatedGenreList,
} from '@/shared/types/api';
import { useToast } from '@/components/providers/ToastProvider';
import { useRef } from 'react';

// Clés de cache pour React Query
export const musicKeys = {
  all: ['music'] as const,
  songs: () => [...musicKeys.all, 'songs'] as const,
  song: (id: string) => [...musicKeys.songs(), id] as const,
  albums: () => [...musicKeys.all, 'albums'] as const,
  album: (id: string) => [...musicKeys.albums(), id] as const,
  artistSongs: (artistId: string) => [...musicKeys.songs(), 'artist', artistId] as const,
  artistAlbums: (artistId: string) => [...musicKeys.albums(), 'artist', artistId] as const,
  genres: () => [...musicKeys.all, 'genres'] as const,
  categories: () => [...musicKeys.all, 'categories'] as const,
};

// Hooks pour les Songs
export function useSongs(params?: {
  artist?: string;
  album?: string;
  genre?: string;
  is_published?: boolean;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: [...musicKeys.songs(), params],
    queryFn: async (): Promise<ApiPaginatedSongList> => {
      const queryParams = new URLSearchParams();
      if (params?.artist) queryParams.append('artist', params.artist);
      if (params?.album) queryParams.append('album', params.album);
      if (params?.genre) queryParams.append('genre', params.genre);
      if (params?.is_published !== undefined) queryParams.append('is_published', params.is_published.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      
      const endpoint = `/songs/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await apiService.get<ApiPaginatedSongList>(endpoint);
      return response.data!;
    },
    staleTime: 5 * 60 * 1000, // Cache pendant 5 minutes
  });
}

export function useSong(id: string) {
  return useQuery({
    queryKey: musicKeys.song(id),
    queryFn: async (): Promise<ApiSong> => {
      const response = await apiService.get<ApiSong>(`/songs/${id}/`);
      return response.data!;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useArtistSongs(artistId: string) {
  return useQuery({
    queryKey: musicKeys.artistSongs(artistId),
    queryFn: async (): Promise<ApiPaginatedSongList> => {
      const endpoint = `/songs/?artist=${artistId}`;
      const response = await apiService.get<ApiPaginatedSongList>(endpoint);
      return response.data!;
    },
    enabled: !!artistId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSong() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingCreateSongRef = useRef<string>('');
  
  return useMutation({
    mutationFn: async (data: CreateSongData): Promise<ApiSong> => {
      const formData = new FormData();
      loadingCreateSongRef.current = toast.showLoading('Chargement', 'Track en cours de création');
      formData.append('title', data.title);
      formData.append('artist', data.artist);
      if (data.album) formData.append('album', data.album);
      if (data.genre) formData.append('genre', data.genre);
      if (data.track_number) formData.append('track_number', data.track_number.toString());
      if (data.is_explicit) formData.append('is_explicit', data.is_explicit.toString());
      if (data.audio_file) formData.append('audio_file', data.audio_file);
      if (data.cover_image) formData.append('cover', data.cover_image);
      if (data.is_published) formData.append('is_published', data.is_published.toString());
      if (data.duration) formData.append('duration', data.duration.toString());

      const response = await apiService.post<ApiSong>('/songs/', formData);
      return response.data!;
    },
    onSuccess: (data) => {
      // Invalider les listes de songs
      queryClient.invalidateQueries({ queryKey: musicKeys.songs() });
      queryClient.invalidateQueries({ queryKey: musicKeys.artistSongs(data.artist.id) });
      // Ajouter le nouveau song au cache
      queryClient.setQueryData(musicKeys.song(data.id), data);
      if (data.album) {
        queryClient.invalidateQueries({ queryKey: musicKeys.albums() });
        queryClient.invalidateQueries({ queryKey: musicKeys.artistAlbums(data.artist.id) });
        queryClient.invalidateQueries({ queryKey: musicKeys.album(data.album.id) });
      }
      toast.dismissLoading(loadingCreateSongRef.current);
      toast.showSuccess('Succès', 'Track créé avec succès');
    },
    onError: (error) => {
      toast.dismissLoading(loadingCreateSongRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la création du track ' + error.message);
    },
  });
}

export function useUpdateSong() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingUpdateSongRef = useRef<string>('');

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSongData }): Promise<ApiSong> => {
      const formData = new FormData();
      loadingUpdateSongRef.current = toast.showLoading('Chargement', 'Track en cours de mise à jour');
      if (data.title) formData.append('title', data.title);
      if (data.artist) formData.append('artist', data.artist);
      if (data.album) formData.append('album', data.album);
      if (data.genre) formData.append('genre', data.genre);
      if (data.track_number) formData.append('track_number', data.track_number.toString());
      if (data.is_explicit) formData.append('is_explicit', data.is_explicit.toString());
      if (data.audio_file) formData.append('audio_file', data.audio_file);
      if (data.cover_image) formData.append('cover', data.cover_image);
      if (data.is_published !== undefined) formData.append('is_published', data.is_published.toString());
      if (data.duration) formData.append('duration', data.duration.toString());

      const response = await apiService.patch<ApiSong>(`/songs/${id}/`, formData);
      return response.data!;
    },
    onSuccess: (data) => {
      // Mettre à jour le cache
      queryClient.setQueryData(musicKeys.song(data.id), data);
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: musicKeys.songs() });
      queryClient.invalidateQueries({ queryKey: musicKeys.artistSongs(data.artist.id) });
      toast.dismissLoading(loadingUpdateSongRef.current);
      toast.showSuccess('Succès', 'Track mis à jour avec succès');
    },
    onError: (error) => {
      toast.dismissLoading(loadingUpdateSongRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la mise à jour du track ' + error.message);
    },
  });
}

export function useDeleteSong() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingDeleteSongRef = useRef<string>('');
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      loadingDeleteSongRef.current = toast.showLoading('Chargement', 'Track en cours de suppression');
      await apiService.delete(`/songs/${id}/`);
    },
    onSuccess: (_, id) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: musicKeys.song(id) });
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: musicKeys.songs() });
        
      toast.dismissLoading(loadingDeleteSongRef.current);
      toast.showSuccess('Succès', 'Track supprimé avec succès');
    },
    onError: (error) => {
      toast.dismissLoading(loadingDeleteSongRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la suppression du track ' + error.message);
    },
  });
}

export function useToggleSongFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiService.patch(`/songs/${id}/toggle-favorite/`, {});
    },
    onSuccess: (_, id) => {
      // Invalider le song spécifique
      queryClient.invalidateQueries({ queryKey: musicKeys.song(id) });
    },
  });
}

// Hooks pour les Albums
export function useAlbums(params?: {
  artist?: string;
  category?: string;
  genre?: string;
  is_published?: boolean;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: [...musicKeys.albums(), params],
    queryFn: async (): Promise<ApiPaginatedAlbumList> => {
      const queryParams = new URLSearchParams();
      if (params?.artist) queryParams.append('artist', params.artist);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.genre) queryParams.append('genre', params.genre);
      if (params?.is_published !== undefined) queryParams.append('is_published', params.is_published.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      
      const endpoint = `/albums/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await apiService.get<ApiPaginatedAlbumList>(endpoint);
      return response.data!;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAlbum(id: string) {
  return useQuery({
    queryKey: musicKeys.album(id),
    queryFn: async (): Promise<ApiAlbum> => {
      const response = await apiService.get<ApiAlbum>(`/albums/${id}/`);
      return response.data!;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useArtistAlbums(artistId: string) {
  return useQuery({
    queryKey: musicKeys.artistAlbums(artistId),
    queryFn: async (): Promise<ApiPaginatedAlbumList> => {
      const endpoint = `/albums/?artist=${artistId}`;
      const response = await apiService.get<ApiPaginatedAlbumList>(endpoint);
      return response.data!;
    },
    // enabled: !!artistId,
    // staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');

  return useMutation({
    mutationFn: async (data: CreateAlbumData): Promise<ApiAlbum> => {
      const formData = new FormData();
      loadingRef.current = toast.showLoading('Chargement', 'Album en cours de création');
      formData.append('title', data.title);
      if (data.release_date) formData.append('release_date', data.release_date);
      if (data.description) formData.append('description', data.description);
      if (data.cover_image) formData.append('cover', data.cover_image);
      if (data.artist) formData.append('artist', data.artist);
      if (data.is_published) formData.append('is_published', data.is_published.toString());

      const response = await apiService.post<ApiAlbum>('/albums/', formData);
      return response.data!;
    },
    onSuccess: (data) => {
      toast.dismissLoading(loadingRef.current);

      // Invalider les listes d'albums
      queryClient.invalidateQueries({ queryKey: musicKeys.albums() });
      // Ajouter le nouvel album au cache
      queryClient.setQueryData(musicKeys.album(data.id), data);
      toast.showSuccess('Succès', 'Album créé avec succès');
    },
    onError: (error) => {
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la création de l\'album ' + error.message);
    },
  });
}

export function useUpdateAlbum() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingUpdateAlbumRef = useRef<string>('');
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAlbumData }): Promise<ApiAlbum> => {
      const formData = new FormData();
console.log(data);

      loadingUpdateAlbumRef.current = toast.showLoading('Chargement', 'Album en cours de mise à jour');
      if (data.title) formData.append('title', data.title);
      if (data.release_date) formData.append('release_date', data.release_date);
      if (data.description) formData.append('description', data.description);
      if (data.cover_image) formData.append('cover', data.cover_image);
      if (data.is_published) formData.append('is_published', data.is_published.toString());

      const response = await apiService.patch<ApiAlbum>(`/albums/${id}/`, formData);
      return response.data!;
    },
    onSuccess: (data) => {
      // Mettre à jour le cache
      queryClient.setQueryData(musicKeys.album(data.id), data);
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: musicKeys.albums() });
      queryClient.invalidateQueries({ queryKey: musicKeys.artistAlbums(data.artist.id) });
      toast.dismissLoading(loadingUpdateAlbumRef.current);
      toast.showSuccess('Succès', 'Album mis à jour avec succès');
    },
    onError: (error) => {
      toast.dismissLoading(loadingUpdateAlbumRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la mise à jour de l\'album ' + error.message);
    },
  });
}

export function useDeleteAlbum() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingDeleteAlbumRef = useRef<string>('');

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      loadingDeleteAlbumRef.current = toast.showLoading('Chargement', 'Album en cours de suppression');
      await apiService.delete(`/albums/${id}/`);
    },
    onSuccess: (_, id) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: musicKeys.album(id) });
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: musicKeys.albums() });
      toast.dismissLoading(loadingDeleteAlbumRef.current);
      toast.showSuccess('Succès', 'Album supprimé avec succès');
    },
    onError: (error) => {
      toast.dismissLoading(loadingDeleteAlbumRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la suppression de l\'album ' + error.message);
    },
  });
}

// Hook pour récupérer les genres
export function useGenres() {
  return useQuery({
    queryKey: musicKeys.genres(),
    queryFn: async (): Promise<ApiPaginatedGenreList> => {
      const response = await apiService.get<ApiPaginatedGenreList>('/genre/');
      return response.data || { count: 0, results: [] };
    },
    staleTime: 10 * 60 * 1000, // Cache pendant 10 minutes
  });
}

// Hook pour récupérer les catégories
export function useCategories() {
  return useQuery({
    queryKey: musicKeys.categories(),
    queryFn: async (): Promise<ApiCategory[]> => {
      const response = await apiService.get<ApiCategory[]>('/category/');
      return response.data || [];
    },
    staleTime: 10 * 60 * 1000, // Cache pendant 10 minutes
  });
} 