import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { Information, CreateInformationRequest, UpdateInformationRequest, InformationFilters } from '@/shared/types';

// Clés de cache pour les requêtes d'informations
export const informationKeys = {
  all: ['informations'] as const,
  lists: () => [...informationKeys.all, 'list'] as const,
  list: (filters: InformationFilters) => [...informationKeys.lists(), filters] as const,
  details: () => [...informationKeys.all, 'detail'] as const,
  detail: (id: string) => [...informationKeys.details(), id] as const,
};

// Hook pour récupérer toutes les informations
export const useInformations = (filters?: InformationFilters) => {
  return useQuery({
    queryKey: informationKeys.list(filters || {}),
    queryFn: async (): Promise<Information[]> => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      
      const response = await apiService.get(`/informations/${params.toString() ? `?${params.toString()}` : ''}`);
      return response.data as Information[];
    },
  });
};

// Hook pour récupérer une information par ID
export const useInformationById = (id: string) => {
  return useQuery({
    queryKey: informationKeys.detail(id),
    queryFn: async (): Promise<Information> => {
      const response = await apiService.get(`/informations/${id}/`);
      return response.data as Information;
    },
    enabled: !!id,
  });
};

// Hook pour créer une information
export const useCreateInformation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateInformationRequest): Promise<Information> => {
      const response = await apiService.post('/informations/', data);
      return response.data as Information;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: informationKeys.lists() });
    },
  });
};

// Hook pour mettre à jour une information
export const useUpdateInformation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInformationRequest }): Promise<Information> => {
      const response = await apiService.patch(`/informations/${id}/`, data);
      return response.data as Information;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: informationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: informationKeys.detail(id) });
    },
  });
};

// Hook pour supprimer une information
export const useDeleteInformation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiService.delete(`/informations/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: informationKeys.lists() });
    },
  });
};
