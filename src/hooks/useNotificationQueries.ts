import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import {
  ApiPaginatedNotificationList,
  ApiLiveStream,
  ApiPaginatedLiveStreamList,
  CreateLiveStreamData,
  UpdateLiveStreamData,
} from '@/shared/types/api';

// Clés de cache pour React Query
export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
  unread: () => [...notificationKeys.all, 'unread'] as const,
};

export const liveStreamKeys = {
  all: ['liveStreams'] as const,
  list: () => [...liveStreamKeys.all, 'list'] as const,
  live: (id: string) => [...liveStreamKeys.all, 'live', id] as const,
  artist: (artistId: string) => [...liveStreamKeys.all, 'artist', artistId] as const,
};

// Hooks pour les Notifications
export function useNotifications(params?: {
  user?: string;
  createdAt?: string;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: [...notificationKeys.list(), params],
    queryFn: async (): Promise<ApiPaginatedNotificationList> => {
      const queryParams = new URLSearchParams();
      if (params?.user) queryParams.append('user', params.user);
      if (params?.createdAt) queryParams.append('createdAt', params.createdAt);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      
      const endpoint = `/notification/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<ApiPaginatedNotificationList>(endpoint);
      return response.data!;
    },
    staleTime: 2 * 60 * 1000, // Cache pendant 2 minutes
  });
}

export function useUnreadNotifications() {
  return useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: async (): Promise<ApiPaginatedNotificationList> => {
      const response = await apiService.get<ApiPaginatedNotificationList>('/notification/?is_read=false');
      return response.data!;
    },
    staleTime: 1 * 60 * 1000, // Cache pendant 1 minute
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiService.put('/notification/setAllRead/', { is_read: true });
    },
    onSuccess: () => {
      // Invalider toutes les requêtes de notifications
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiService.patch(`/notification/${id}/`, { is_read: true });
    },
    onSuccess: () => {
      // Invalider les requêtes de notifications
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

// Hooks pour les Live Streams
export function useLiveStreams(params?: {
  artist?: string;
  is_live?: boolean;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: [...liveStreamKeys.list(), params],
    queryFn: async (): Promise<ApiPaginatedLiveStreamList> => {
      const queryParams = new URLSearchParams();
      if (params?.artist) queryParams.append('artist', params.artist);
      if (params?.is_live !== undefined) queryParams.append('is_live', params.is_live.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      
      const endpoint = `/live/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<ApiPaginatedLiveStreamList>(endpoint);
      return response.data!;
    },
    staleTime: 30 * 1000, // Cache pendant 30 secondes pour les lives
  });
}

export function useLiveStream(id: string) {
  return useQuery({
    queryKey: liveStreamKeys.live(id),
    queryFn: async (): Promise<ApiLiveStream> => {
      const response = await apiService.get<ApiLiveStream>(`/live/${id}/`);
      return response.data!;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000, // Refetch toutes les 30 secondes pour les lives
  });
}

export function useArtistLiveStreams(artistId: string) {
  return useQuery({
    queryKey: liveStreamKeys.artist(artistId),
    queryFn: async (): Promise<ApiPaginatedLiveStreamList> => {
      const response = await apiService.get<ApiPaginatedLiveStreamList>(`/live/?artist=${artistId}`);
      return response.data!;
    },
    enabled: !!artistId,
    staleTime: 30 * 1000,
  });
}

export function useCreateLiveStream() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLiveStreamData): Promise<ApiLiveStream> => {
      const response = await apiService.post<ApiLiveStream>('/live/', data);
      return response.data!;
    },
    onSuccess: (data) => {
      // Invalider les listes de live streams
      queryClient.invalidateQueries({ queryKey: liveStreamKeys.list() });
      queryClient.invalidateQueries({ queryKey: liveStreamKeys.artist(data.artist || '') });
      // Ajouter le nouveau live stream au cache
      queryClient.setQueryData(liveStreamKeys.live(data.id), data);
    },
  });
}

export function useUpdateLiveStream() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLiveStreamData }): Promise<ApiLiveStream> => {
      const response = await apiService.patch<ApiLiveStream>(`/live/${id}/`, data);
      return response.data!;
    },
    onSuccess: (data) => {
      // Mettre à jour le cache
      queryClient.setQueryData(liveStreamKeys.live(data.id), data);
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: liveStreamKeys.list() });
      queryClient.invalidateQueries({ queryKey: liveStreamKeys.artist(data.artist || '') });
    },
  });
}

export function useDeleteLiveStream() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiService.delete(`/live/${id}/`);
    },
    onSuccess: (_, id) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: liveStreamKeys.live(id) });
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: liveStreamKeys.list() });
    },
  });
}

export function useStartLiveStream() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<ApiLiveStream> => {
      const response = await apiService.patch<ApiLiveStream>(`/live/${id}/start/`, {});
      return response.data!;
    },
    onSuccess: (data) => {
      // Mettre à jour le cache
      queryClient.setQueryData(liveStreamKeys.live(data.id), data);
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: liveStreamKeys.list() });
      queryClient.invalidateQueries({ queryKey: liveStreamKeys.artist(data.artist || '') });
    },
  });
}

export function useEndLiveStream() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<ApiLiveStream> => {
      const response = await apiService.patch<ApiLiveStream>(`/live/${id}/end/`, {});
      return response.data!;
    },
    onSuccess: (data) => {
      // Mettre à jour le cache
      queryClient.setQueryData(liveStreamKeys.live(data.id), data);
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: liveStreamKeys.list() });
      queryClient.invalidateQueries({ queryKey: liveStreamKeys.artist(data.artist || '') });
    },
  });
} 