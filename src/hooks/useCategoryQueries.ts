import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category, CategoryCreateRequest, CategoryUpdateRequest, CategoryListResponse } from '@/shared/types/category';
import { apiService } from '@/lib/api';
import { useToast } from '@/components/providers/ToastProvider';
import { useRef } from 'react';

// Hook pour récupérer la liste des catégories
export const useCategoryList = (params?: {
  page?: number;
  page_size?: number;
  name?: string;
  slug?: string;
  is_active?: boolean;
}) => {
  return useQuery<CategoryListResponse>({
    queryKey: ['categories', params],
    queryFn: async (): Promise<CategoryListResponse> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
      if (params?.name) searchParams.append('name', params.name);
      if (params?.slug) searchParams.append('slug', params.slug);
      if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());

      const response = await apiService.get(`/category/?${searchParams.toString()}`);
      return response.data as CategoryListResponse;
    },
  });
};

// Hook pour récupérer une catégorie par ID
export const useCategory = (id: string) => {
  return useQuery<Category>({
    queryKey: ['category', id],
    queryFn: async (): Promise<Category> => {
      const response = await apiService.get(`/category/${id}/`);
      return response.data as Category;
    },
    enabled: !!id,
  });
};

// Hook pour créer une catégorie
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');

  return useMutation<Category, Error, CategoryCreateRequest>({
    mutationFn: async (data: CategoryCreateRequest) => {
      loadingRef.current = toast.showLoading('Chargement', 'Catégorie en cours de création');
      const response = await apiService.post('/category/', data);
      return response.data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.dismissLoading(loadingRef.current);
      toast.showSuccess('Succès', 'Catégorie créée avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la création de la catégorie ' + error.message);
    },
  });
};

// Hook pour mettre à jour une catégorie
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');
  
  return useMutation<Category, Error, { id: string; data: CategoryUpdateRequest }>({
    mutationFn: async ({ id, data }) => {
      loadingRef.current = toast.showLoading('Chargement', 'Catégorie en cours de mise à jour');
      const response = await apiService.put(`/category/${id}/`, data);
      return response.data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.dismissLoading(loadingRef.current);
      toast.showSuccess('Succès', 'Catégorie mise à jour avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la mise à jour de la catégorie ' + error.message);
    },
  });
};

// Hook pour supprimer une catégorie (suppression partielle)
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');
  
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      loadingRef.current = toast.showLoading('Chargement', 'Catégorie en cours de suppression');
      await apiService.delete(`/category/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.dismissLoading(loadingRef.current);
      toast.showSuccess('Succès', 'Catégorie supprimée avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la suppression de la catégorie ' + error.message);
    },
  });
};

// Hook pour supprimer définitivement une catégorie
export const useRealDeleteCategory = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');
  
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      loadingRef.current = toast.showLoading('Chargement', 'Catégorie en cours de suppression définitive');
      await apiService.delete(`/category/${id}/realDelete/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.dismissLoading(loadingRef.current);
      toast.showSuccess('Succès', 'Catégorie supprimée définitivement avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la suppression définitive de la catégorie ' + error.message);
    },
  });
};
