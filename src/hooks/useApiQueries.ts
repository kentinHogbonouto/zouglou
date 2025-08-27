import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions, UseQueryResult } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { ApiResponse, PaginatedResponse } from '@/shared/types';
import { City } from '@/shared/types/api';

// Clés de cache génériques
export const queryKeys = {
  // Utilisateurs
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: unknown) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  // Tracks/Musique
  tracks: {
    all: ['tracks'] as const,
    lists: () => [...queryKeys.tracks.all, 'list'] as const,
    list: (filters: unknown) => [...queryKeys.tracks.lists(), filters] as const,
    details: () => [...queryKeys.tracks.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.tracks.details(), id] as const,
    popular: () => [...queryKeys.tracks.all, 'popular'] as const,
    recent: () => [...queryKeys.tracks.all, 'recent'] as const,
  },
  // Artistes
  artists: {
    all: ['artists'] as const,
    lists: () => [...queryKeys.artists.all, 'list'] as const,
    list: (filters: unknown) => [...queryKeys.artists.lists(), filters] as const,
    details: () => [...queryKeys.artists.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.artists.details(), id] as const,
  },
  // Statistiques
  stats: {
    all: ['stats'] as const,
    dashboard: () => [...queryKeys.stats.all, 'dashboard'] as const,
    analytics: () => [...queryKeys.stats.all, 'analytics'] as const,
  },
};

// Hook générique pour les requêtes GET
export function useApiQuery<T>(
  key: readonly unknown[],
  endpoint: string,
  options?: Omit<UseQueryOptions<ApiResponse<T>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: key,
    queryFn: () => apiService.get<T>(endpoint),
    ...options,
  });
}

// Hook générique pour les requêtes GET paginées
export function usePaginatedQuery<T>(
  key: readonly unknown[],
  endpoint: string,
  page = 1,
  limit = 10,
  options?: Omit<UseQueryOptions<PaginatedResponse<T>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...key, page, limit],
    queryFn: () => apiService.getPaginated<T>(endpoint, page, limit),
    ...options,
  });
}

// Hook générique pour les mutations POST
export function useApiMutation<TData, TVariables>(
  endpoint: string,
  options?: Omit<UseMutationOptions<ApiResponse<TData>, Error, TVariables>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: TVariables) => apiService.post<TData>(endpoint, variables),
    onSuccess: () => {
      // Invalider les requêtes liées
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tracks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.artists.all });
    },
    ...options,
  });
}

// Hook générique pour les mutations PUT
export function useApiUpdate<TData, TVariables>(
  endpoint: string,
  options?: Omit<UseMutationOptions<ApiResponse<TData>, Error, TVariables>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: TVariables) => apiService.put<TData>(endpoint, variables),
    onSuccess: () => {
      // Invalider les requêtes liées
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tracks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.artists.all });
    },
    ...options,
  });
}

// Hook générique pour les mutations DELETE
export function useApiDelete<TData>(
  endpoint: string,
  options?: Omit<UseMutationOptions<ApiResponse<TData>, Error, void>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiService.delete<TData>(endpoint),
    onSuccess: () => {
      // Invalider les requêtes liées
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tracks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.artists.all });
    },
    ...options,
  });
}

// Hooks spécifiques pour les utilisateurs
export function useUsers(page = 1, limit = 10) {
  return usePaginatedQuery(queryKeys.users.list({ page, limit }), '/account/', page, limit);
}

export function useUserByIdFromApi(id: string) {
  return useApiQuery(queryKeys.users.detail(id), `/account/${id}/`);
}

// Hooks spécifiques pour les tracks
export function useTracks(page = 1, limit = 10) {
  return usePaginatedQuery(queryKeys.tracks.list({ page, limit }), '/tracks/', page, limit);
}

export function useTrack(id: string) {
  return useApiQuery(queryKeys.tracks.detail(id), `/tracks/${id}/`);
}

export function usePopularTracks() {
  return useApiQuery(queryKeys.tracks.popular(), '/tracks/popular/');
}

export function useRecentTracks() {
  return useApiQuery(queryKeys.tracks.recent(), '/tracks/recent/');
}

// Hooks spécifiques pour les artistes
export function useArtistList() {
  return usePaginatedQuery(queryKeys.artists.list({ page: 1, limit: 10000 }), '/artist/', 1, 10000);
}

export function useArtists(page = 1, limit = 10) {
  return usePaginatedQuery(queryKeys.artists.list({ page, limit }), '/artist/', page, limit);
}

export function useArtist(id: string) {
  return useApiQuery(queryKeys.artists.detail(id), `/artist/${id}/`);
}

// Hooks pour les statistiques
export function useDashboardStats() {
  return useApiQuery(queryKeys.stats.dashboard(), '/stats/dashboard/');
}

export function useAnalytics() {
  return useApiQuery(queryKeys.stats.analytics(), '/stats/analytics/');
}

export const useCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const response = await apiService.get('/city/');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  }) as UseQueryResult<City[], Error>;
}; 