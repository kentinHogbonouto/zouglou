import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { Faq, CreateFaqRequest, UpdateFaqRequest, FaqFilters } from '@/shared/types';

// Clés de cache pour les requêtes FAQ
export const faqKeys = {
  all: ['faqs'] as const,
  lists: () => [...faqKeys.all, 'list'] as const,
  list: (filters: FaqFilters) => [...faqKeys.lists(), filters] as const,
  details: () => [...faqKeys.all, 'detail'] as const,
  detail: (id: string) => [...faqKeys.details(), id] as const,
};

// Hook pour récupérer toutes les FAQ
export const useFaqs = (filters?: FaqFilters) => {
  return useQuery({
    queryKey: faqKeys.list(filters || {}),
    queryFn: async (): Promise<Faq[]> => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.position !== undefined) params.append('position', filters.position.toString());
      
      const response = await apiService.get(`/faq/${params.toString() ? `?${params.toString()}` : ''}`);
      return response.data as Faq[];
    },
  });
};

// Hook pour récupérer une FAQ par ID
export const useFaqById = (id: string) => {
  return useQuery({
    queryKey: faqKeys.detail(id),
    queryFn: async (): Promise<Faq> => {
      const response = await apiService.get(`/faq/${id}/`);
      return response.data as Faq;
    },
    enabled: !!id,
  });
};

// Hook pour créer une FAQ
export const useCreateFaq = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateFaqRequest): Promise<Faq> => {
      const response = await apiService.post('/faq/', data);
      return response.data as Faq;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
  });
};

// Hook pour mettre à jour une FAQ
export const useUpdateFaq = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFaqRequest }): Promise<Faq> => {
      const response = await apiService.patch(`/faq/${id}/`, data);
      return response.data as Faq;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
      queryClient.invalidateQueries({ queryKey: faqKeys.detail(id) });
    },
  });
};

// Hook pour supprimer une FAQ
export const useDeleteFaq = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiService.delete(`/faq/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
  });
};
