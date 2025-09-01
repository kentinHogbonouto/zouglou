import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { Genre, GenreCreateRequest, GenreUpdateRequest, GenreListResponse } from '@/shared/types/genre';
import { useToast } from '@/components/providers/ToastProvider';
import { useRef } from 'react';

// Hook pour récupérer la liste des genres
export const useGenreList = (params?: {
  page?: number;
  page_size?: number;
  name?: string;
  slug?: string;
  is_active?: boolean;
}) => {
  return useQuery<GenreListResponse>({
    queryKey: ['genres', params],
    queryFn: async (): Promise<GenreListResponse> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
      if (params?.name) searchParams.append('name', params.name);
      if (params?.slug) searchParams.append('slug', params.slug);
      if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());

      const response = await apiService.get(`/genre/?${searchParams.toString()}`);
      return response.data as GenreListResponse;
    },
  });
};

// Hook pour récupérer un genre par ID
export const useGenre = (id: string) => {
  return useQuery<Genre>({
    queryKey: ['genre', id],
    queryFn: async (): Promise<Genre> => {
      const response = await apiService.get(`/genre/${id}/`);
      return response.data as Genre;
    },
    enabled: !!id,
  });
};

// Hook pour créer un genre
export const useCreateGenre = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');

  return useMutation<Genre, Error, GenreCreateRequest>({
    mutationFn: async (data: GenreCreateRequest) : Promise<Genre> => {
      loadingRef.current = toast.showLoading('Chargement', 'Genre en cours de création');
      const response = await apiService.post('/genre/', data);
      return response.data as Genre;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.dismissLoading(loadingRef.current);
      toast.showSuccess('Succès', 'Genre créé avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la création du genre ' + error.message);
    },
  });
};

// Hook pour mettre à jour un genre
export const useUpdateGenre = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');

  return useMutation<Genre, Error, { id: string; data: GenreUpdateRequest }>({
    mutationFn: async ({ id, data }) : Promise<Genre> => {
      const response = await apiService.put(`/genre/${id}/`, data);
      return response.data as Genre;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      queryClient.invalidateQueries({ queryKey: ['genre', id] });
      toast.dismissLoading(loadingRef.current);
      toast.showSuccess('Succès', 'Genre mis à jour avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la mise à jour du genre ' + error.message);
    },
  });
};

// Hook pour supprimer un genre (suppression partielle)
export const useDeleteGenre = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      loadingRef.current = toast.showLoading('Chargement', 'Genre en cours de suppression');
      await apiService.delete(`/genre/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.dismissLoading(loadingRef.current);
      toast.showSuccess('Succès', 'Genre supprimé avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la suppression du genre ' + error.message);
    },
  });
};

// Hook pour supprimer définitivement un genre
export const useRealDeleteGenre = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      loadingRef.current = toast.showLoading('Chargement', 'Genre en cours de suppression définitive');
      await apiService.delete(`/genre/${id}/realDelete/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.dismissLoading(loadingRef.current);
      toast.showSuccess('Succès', 'Genre supprimé définitivement avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la suppression définitive du genre ' + error.message);
    },
  });
};
