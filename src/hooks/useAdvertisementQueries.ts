'use client';

import {  useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdvertisementFormData, Advertisement, AdvertisementResponse } from '@/shared/types/advertisement';
import { apiService } from '@/lib/api';
import { useToast } from '@/components/providers/ToastProvider';

// Clés de cache pour React Query
export const advertisementKeys = {
  all: ['advertisements'] as const,
  lists: () => [...advertisementKeys.all, 'list'] as const,
  list: (filters: {
    page?: number;
    pageSize?: number;
    isActive?: boolean;
  }) => [...advertisementKeys.lists(), filters] as const,
  details: () => [...advertisementKeys.all, 'detail'] as const,
  detail: (id: string) => [...advertisementKeys.details(), id] as const,
};


export function useAdvertisements(page: number, pageSize: number, params?: {
    page?: number;
    pageSize?: number;
    isActive?: boolean;
}) {
  return useQuery({
    queryKey: advertisementKeys.list(params || {}),
    queryFn: async (): Promise<AdvertisementResponse> => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize) queryParams.append('page_size', params.pageSize.toString());
      if (params?.isActive !== undefined) queryParams.append('is_active', params.isActive.toString());
      
      const endpoint = `/advertisements/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await apiService.get(endpoint);
      return response.data as AdvertisementResponse;
    },
    staleTime: 5 * 60 * 1000, // Cache pendant 5 minutes
  });
}


export function useAdvertisement(id: string) {
  return useQuery({
    queryKey: advertisementKeys.detail(id),
    queryFn: async (): Promise<Advertisement> => {
      const response = await apiService.get(`/advertisements/${id}/`);
      return response.data as Advertisement;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}


export function useCreateAdvertisement() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');

  return useMutation({
    mutationFn: async (data: AdvertisementFormData): Promise<Advertisement> => {
      const formData = new FormData();
      loadingRef.current = toast.showLoading('Chargement', 'Publicité en cours de création');
      
      Object.entries(data).forEach(([key, value]) => {
        // Inclure les valeurs false pour les champs booléens comme is_active
        if (value !== undefined && value !== null) {
          formData.append(key, value instanceof File ? value : String(value));
        }
      });

      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await apiService.post('/advertisements/', formData);
      return response.data as Advertisement;
    },
    onSuccess: (data) => {
      toast.dismissLoading(loadingRef.current);
      queryClient.invalidateQueries({ queryKey: advertisementKeys.lists() });
      queryClient.setQueryData(advertisementKeys.detail(data.id), data);
      toast.showSuccess('Succès', 'Publicité créée avec succès');
    },
    onError: (error) => {
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la création de la publicité ' + error.message);
    },
  });
}


export function useUpdateAdvertisement() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AdvertisementFormData> }): Promise<Advertisement> => {
      const formData = new FormData();
      loadingRef.current = toast.showLoading('Chargement', 'Publicité en cours de mise à jour');
      
      Object.entries(data).forEach(([key, value]) => {
        // Inclure les valeurs false pour les champs booléens comme is_active
        if (value !== undefined && value !== null) {
          formData.append(key, value instanceof File ? value : String(value));
        }
      });

      console.log('Update FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await apiService.patch(`/advertisements/${id}/`, formData);
      return response.data as Advertisement;
    },
    onSuccess: (data) => {
      toast.dismissLoading(loadingRef.current);
      queryClient.setQueryData(advertisementKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: advertisementKeys.lists() });
      toast.showSuccess('Succès', 'Publicité mise à jour avec succès');
    },
    onError: (error) => {
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la mise à jour de la publicité ' + error.message);
    },
  });
}


export function useDeleteAdvertisement() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      loadingRef.current = toast.showLoading('Chargement', 'Publicité en cours de suppression');
      await apiService.delete(`/advertisements/${id}/`);
    },
    onSuccess: (_, id) => {
      toast.dismissLoading(loadingRef.current);
      queryClient.removeQueries({ queryKey: advertisementKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: advertisementKeys.lists() });
      toast.showSuccess('Succès', 'Publicité supprimée avec succès');
    },
    onError: (error) => {
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la suppression de la publicité ' + error.message);
    },
  });
}


export function useRealDeleteAdvertisement() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      loadingRef.current = toast.showLoading('Chargement', 'Publicité en cours de suppression définitive');
      await apiService.delete(`/advertisements/${id}/realDelete/`);
    },
    onSuccess: (_, id) => {
      toast.dismissLoading(loadingRef.current);
      queryClient.removeQueries({ queryKey: advertisementKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: advertisementKeys.lists() });
      toast.showSuccess('Succès', 'Publicité supprimée définitivement');
    },
    onError: (error) => {
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la suppression définitive de la publicité ' + error.message);
    },
  });
}