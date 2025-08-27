import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import {
  ApiPodcast,
  ApiPodcastEpisode,
  ApiPaginatedPodcastList,
  ApiPaginatedPodcastEpisodeList,
  CreatePodcastData,
  UpdatePodcastData,
  CreatePodcastEpisodeData,
  UpdatePodcastEpisodeData,
} from '@/shared/types/api';

// Clés de cache pour React Query
export const podcastKeys = {
  all: ['podcast'] as const,
  podcastList: () => [...podcastKeys.all, 'podcastList'] as const,
  podcast: (id: string) => [...podcastKeys.podcastList(), id] as const,
  episodeList: () => [...podcastKeys.all, 'episodeList'] as const,
  episode: (id: string) => [...podcastKeys.episodeList(), id] as const,
  artistPodcast: (artistId: string) => [...podcastKeys.podcastList(), 'artist', artistId] as const,
  artistEpisode: (artistId: string) => [...podcastKeys.episodeList(), 'artist', artistId] as const,
  podcastGenres: () => [...podcastKeys.all, 'genres'] as const,
};

// Hooks pour les Podcasts
export function usePodcastList(params?: {
  artist?: string;
  genre?: string;
  is_published?: boolean;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: [...podcastKeys.podcastList(), params],
    queryFn: async (): Promise<ApiPaginatedPodcastList> => {
      const queryParams = new URLSearchParams();
      if (params?.artist) queryParams.append('artist', params.artist);
      if (params?.genre) queryParams.append('genre', params.genre);
      if (params?.is_published !== undefined) queryParams.append('is_published', params.is_published.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      
      const endpoint = `/podcast/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await apiService.get<ApiPaginatedPodcastList>(endpoint);
      return response.data!;
    },
    staleTime: 5 * 60 * 1000, // Cache pendant 5 minutes
  });
}

export function usePodcast(id: string) {
  return useQuery({
    queryKey: podcastKeys.podcast(id),
    queryFn: async (): Promise<ApiPodcast> => {
      const response = await apiService.get<ApiPodcast>(`/podcast/${id}/`);
      return response.data!;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePodcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePodcastData): Promise<ApiPodcast> => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('artist', data.artist);
      formData.append('genre', data.genre);
      if (data.cover) formData.append('cover', data.cover);
      if (data.is_published !== undefined) formData.append('is_published', data.is_published.toString());

      const response = await apiService.post<ApiPodcast>('/podcast/', formData);
      return response.data!;
    },
    onSuccess: (data) => {
      // Invalider les listes de podcasts
      queryClient.invalidateQueries({ queryKey: podcastKeys.podcastList() });
      // Ajouter le nouveau podcast au cache
      queryClient.setQueryData(podcastKeys.podcast(data.id), data);
    },
  });
}

export function useUpdatePodcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePodcastData }): Promise<ApiPodcast> => {
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.artist) formData.append('artist', data.artist);
      if (data.genre) formData.append('genre', data.genre);
      if (data.cover) formData.append('cover', data.cover);
      if (data.is_published !== undefined) formData.append('is_published', data.is_published.toString());

      const response = await apiService.patch<ApiPodcast>(`/podcast/${id}/`, formData);
      return response.data!;
    },
    onSuccess: (data) => {
      // Mettre à jour le cache
      queryClient.setQueryData(podcastKeys.podcast(data.id), data);
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: podcastKeys.podcastList() });
    },
  });
}

export function useDeletePodcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiService.delete(`/podcast/${id}/`);
    },
    onSuccess: (_, id) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: podcastKeys.podcast(id) });
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: podcastKeys.podcastList() });
    },
  });
}

// Hooks pour les Episodes de Podcast
export function usePodcastEpisodeList(params?: {
  artist?: string;
  genre?: string;
  podcast?: string;
  release_date?: string;
  is_published?: boolean;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: [...podcastKeys.episodeList(), params],
    queryFn: async (): Promise<ApiPaginatedPodcastEpisodeList> => {
      const queryParams = new URLSearchParams();
      if (params?.artist) queryParams.append('artist', params.artist);
      if (params?.genre) queryParams.append('genre', params.genre);
      if (params?.podcast) queryParams.append('podcast', params.podcast);
      if (params?.release_date) queryParams.append('release_date', params.release_date);
      if (params?.is_published !== undefined) queryParams.append('is_published', params.is_published.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      
      const endpoint = `/podcast/episodes/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await apiService.get<ApiPaginatedPodcastEpisodeList>(endpoint);
      return response.data!;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePodcastEpisode(id: string) {
  return useQuery({
    queryKey: podcastKeys.episode(id),
    queryFn: async (): Promise<ApiPodcastEpisode> => {
      const endpoint = `/podcast/episodes/${id}/`;
      const response = await apiService.get<ApiPodcastEpisode>(endpoint);
      return response.data!;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePodcastEpisode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePodcastEpisodeData): Promise<ApiPodcastEpisode> => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('file', data.file);
      formData.append('duration', data.duration.toString());
      formData.append('podcast', data.podcast);
      formData.append('episode_number', data.episode_number.toString());
      formData.append('release_date', data.release_date);
      if (data.is_published !== undefined) formData.append('is_published', data.is_published.toString());

      const response = await apiService.post<ApiPodcastEpisode>('/podcast/episodes/', formData);
      return response.data!;
    },
    onSuccess: (data) => {
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: podcastKeys.episodeList() });
      // Ajouter le nouveau episode au cache
      queryClient.setQueryData(podcastKeys.episode(data.id), data);
      // Invalider le cache du podcast parent
      queryClient.invalidateQueries({ queryKey: podcastKeys.podcast(data.podcast) });
    },
  });
}

export function useUpdatePodcastEpisode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePodcastEpisodeData }): Promise<ApiPodcastEpisode> => {
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.file) formData.append('file', data.file);
      if (data.duration !== undefined) formData.append('duration', data.duration.toString());
      if (data.podcast) formData.append('podcast', data.podcast);
      if (data.episode_number !== undefined) formData.append('episode_number', data.episode_number.toString());
      if (data.release_date) formData.append('release_date', data.release_date);
      if (data.is_published !== undefined) formData.append('is_published', data.is_published.toString());

      const response = await apiService.patch<ApiPodcastEpisode>(`/podcast/episodes/${id}/`, formData);
      return response.data!;
    },
    onSuccess: (data) => {
      // Mettre à jour le cache
      queryClient.setQueryData(podcastKeys.episode(data.id), data);
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: podcastKeys.episodeList() });
      // Invalider le cache du podcast parent
      queryClient.invalidateQueries({ queryKey: podcastKeys.podcast(data.podcast) });
    },
  });
}

export function useDeletePodcastEpisode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiService.delete(`/podcast/episodes/${id}/`);
    },
    onSuccess: (_, id) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: podcastKeys.episode(id) });
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: podcastKeys.episodeList() });
    },
  });
}

// Hook pour supprimer définitivement un épisode (soft delete)
export function useDeletePodcastEpisodeReal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiService.delete(`/podcast/episodes/${id}/real/`);
    },
    onSuccess: (_, id) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: podcastKeys.episode(id) });
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: podcastKeys.episodeList() });
    },
  });
}

// Hook pour récupérer les genres de podcasts
export function usePodcastGenres() {
  return useQuery({
    queryKey: podcastKeys.podcastGenres(),
    queryFn: async (): Promise<string[]> => {
      const response = await apiService.get<string[]>('/podcast/genres/');
      return response.data || [];
    },
    staleTime: 10 * 60 * 1000, // Cache pendant 10 minutes
  });
}
