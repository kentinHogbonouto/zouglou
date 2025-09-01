import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { AdminCity, AdminCityCreateRequest, AdminCityUpdateRequest, AdminCityListResponse } from '@/shared/types/city';
import { useToast } from '@/components/providers/ToastProvider';
import { useRef } from 'react';

// Hook pour récupérer la liste des villes
export const useCityList = () => {
  return useQuery<AdminCityListResponse>({
    queryKey: ['cities'],
    queryFn: async (): Promise<AdminCityListResponse> => {
      const response = await apiService.get('/city/');
      return response.data as AdminCityListResponse;
    },
  });
};

// Hook pour récupérer une ville par ID
export const useCity = (id: string) => {
  return useQuery<AdminCity>({
    queryKey: ['city', id],
    queryFn: async (): Promise<AdminCity> => {
      const response = await apiService.get(`/city/${id}/`);
      return response.data as AdminCity;
    },
    enabled: !!id,
  });
};

// Hook pour créer une ville
export const useCreateCity = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');

  return useMutation<AdminCity, Error, AdminCityCreateRequest>({
    mutationFn: async (data: AdminCityCreateRequest): Promise<AdminCity> => {
      loadingRef.current = toast.showLoading('Chargement', 'Ville en cours de création');
      
      // Gérer l'upload du logo si présent
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('status', data.status.toString());
      
      if (data.logo) {
        formData.append('logo', data.logo);
      }
      
      if (data.longitude) {
        formData.append('longitude', data.longitude);
      }
      
      if (data.latitude) {
        formData.append('latitude', data.latitude);
      }

      const response = await apiService.post('/city/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data as AdminCity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      toast.dismissLoading(loadingRef.current);
      toast.showSuccess('Succès', 'Ville créée avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la création de la ville: ' + error.message);
    },
  });
};

// Hook pour mettre à jour une ville
export const useUpdateCity = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');
  
  return useMutation<AdminCity, Error, { id: string; data: AdminCityUpdateRequest }>({
    mutationFn: async ({ id, data }): Promise<AdminCity> => {
      loadingRef.current = toast.showLoading('Chargement', 'Ville en cours de mise à jour');
      
      // Gérer l'upload du logo si présent
      const formData = new FormData();
      
      if (data.name !== undefined) {
        formData.append('name', data.name);
      }
      
      if (data.status !== undefined) {
        formData.append('status', data.status.toString());
      }
      
      if (data.logo !== undefined) {
        if (data.logo) {
          formData.append('logo', data.logo);
        }
      }
      
      if (data.longitude !== undefined) {
        formData.append('longitude', data.longitude || '');
      }
      
      if (data.latitude !== undefined) {
        formData.append('latitude', data.latitude || '');
      }

      const response = await apiService.put(`/city/${id}/`, formData);
      return response.data as AdminCity;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      queryClient.invalidateQueries({ queryKey: ['city', id] });
      toast.dismissLoading(loadingRef.current);
      toast.showSuccess('Succès', 'Ville mise à jour avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la mise à jour de la ville: ' + error.message);
    },
  });
};

// Hook pour supprimer une ville
export const useDeleteCity = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');
  
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      loadingRef.current = toast.showLoading('Chargement', 'Ville en cours de suppression');
      await apiService.delete(`/city/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      toast.dismissLoading(loadingRef.current);
      toast.showSuccess('Succès', 'Ville supprimée avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la suppression de la ville: ' + error.message);
    },
  });
};
