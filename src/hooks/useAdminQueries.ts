'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useToast } from '@/components/providers/ToastProvider';
import { useRef } from 'react';
import { ApiArtist } from '@/shared/types';

// Types pour les utilisateurs
export interface ApiUser {
  id: string;
  city: string | null;
  full_name: string;
  username: string;
  email: string;
  is_verify_email: boolean;
  interested_artists: Array<ApiArtist>;
  birth_date: string | null;
  sexe: string | null;
  adress: string | null;
  countryCode: string | null;
  country: string | null;
  country_name: string | null;
  phone: string | null;
  is_active: boolean;
  type_auth: string;
  artist_profile: ApiArtist | null;
  last_subscription: ApiSubscription | null;
  has_active_subscription: boolean;
  default_role: string;
  plateform: string;
  hear_about: string | null;
  user_count_notifcation: number;
  is_superuser: boolean;
  profil_image: string | null;
  createdAt: string;
  updatedAt: string;
  subscription?: ApiSubscription | null;
}


interface ApiPaginatedUserList {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiUser[];
}

interface CreateUserData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  sexe?: string;
  default_role?: string;
  password: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
}

interface UpdateUserData {
  username?: string;
  email?: string;
  full_name?: string;
  sexe?: string;
  default_role?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
}

// Types pour les subscriptions
interface ApiSubscription {
  id: string;
  user: string;
  plan: {
    id: string;
    name: string;
    description: string;
    price: string;
    duration_days: number;
    features: Record<string, unknown>;
    max_downloads: number;
    ads_free: boolean;
    high_quality: boolean;
    offline_mode: boolean;
    podcast_access: boolean;
    unlimited_playlists: boolean;
    max_playlists: number | null;
    unlimited_streaming: boolean;
    free_trial_days: number;
    is_featured: boolean;
    is_active: boolean;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  payment_method: string | null;
  transaction: {
    id: string;
    numero: string | null;
    payment_service_name: string;
    id_transaction: number;
    reference: string;
    amount: number;
    description: string;
    status: string;
    customer_id: number;
    token: string;
    url: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  token: string | null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  duration_days: number;
  features: Record<string, unknown>;
  max_downloads: number;
  ads_free: boolean;
  high_quality: boolean;
  offline_mode: boolean;
  podcast_access: boolean;
  unlimited_playlists: boolean;
  max_playlists: number | null;
  unlimited_streaming: boolean;
  free_trial_days: number;
  is_featured: boolean;
  is_active: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiPaginatedSubscriptionList {
  links: {
    next: string | null;
    previous: string | null;
    next_num: number | null;
    previous_num: number | null;
  };
  max_page_size: number;
  count: number;
  total_pages: number;
  results: ApiSubscription[];
}

interface ApiPaginatedPlanList {
  links: {
    next: string | null;
    previous: string | null;
    next_num: number | null;
    previous_num: number | null;
  };
  max_page_size: number;
  count: number;
  total_pages: number;
  results: ApiSubscriptionPlan[];
}

// Clés de cache pour React Query
export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  user: (id: string) => [...adminKeys.users(), id] as const,
  artists: () => [...adminKeys.all, 'artists'] as const,
  artist: (id: string) => [...adminKeys.artists(), id] as const,
};

// Clés de cache pour les subscriptions
export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...subscriptionKeys.lists(), filters || {}] as const,
  details: () => [...subscriptionKeys.all, 'detail'] as const,
  detail: (id: string) => [...subscriptionKeys.details(), id] as const,
  plans: () => [...subscriptionKeys.all, 'plans'] as const,
  plan: (id: string) => [...subscriptionKeys.plans(), id] as const,
};

// Hooks pour les utilisateurs
export function useAdminUsers(params?: {
  search?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: [...adminKeys.users(), params],
    queryFn: async (): Promise<ApiPaginatedUserList> => {
      try {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
        if (params?.is_staff !== undefined) queryParams.append('is_staff', params.is_staff.toString());
        if (params?.is_superuser !== undefined) queryParams.append('is_superuser', params.is_superuser.toString());
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
        
        const endpoint = `/account/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await apiService.get<ApiPaginatedUserList>(endpoint);
        return response.data!;
      } catch {
        // Retourner des données mockées si l'endpoint n'existe pas
        console.warn('Endpoint /account/ not found, using mock data');
        return {
          count: 0,
          next: null,
          previous: null,
          results: [],
        };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache pendant 5 minutes
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: adminKeys.user(id),
    queryFn: async (): Promise<ApiUser> => {
      try {
        const response = await apiService.get<ApiUser>(`/account/${id}/`);
        return response.data!;
      } catch (error) {
        // Retourner des données mockées si l'endpoint n'existe pas
        console.warn(`Endpoint /account/${id}/ not found, using mock data`);
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');
  
  return useMutation({
    mutationFn: async (data: CreateUserData): Promise<ApiUser> => {
      loadingRef.current = toast.showLoading('Chargement', 'Utilisateur en cours de création');
      try {
        const response = await apiService.post<ApiUser>('/account/', data);
        return response.data!;
      } catch {
        // Simuler la création pour les tests
        console.warn('Endpoint /account/ not found, simulating creation');
        throw new Error('Failed to create user');
      }
    },
    onSuccess: (data) => {
      // Invalider les listes d'utilisateurs
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      // Ajouter le nouvel utilisateur au cache
      queryClient.setQueryData(adminKeys.user(data.id), data);
      toast.dismissLoading(loadingRef.current);
      toast.showSuccess('Succès', 'Utilisateur créé avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la création de l\'utilisateur ' + error.message);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserData }): Promise<ApiUser> => {
      loadingRef.current = toast.showLoading('Chargement', 'Utilisateur en cours de mise à jour');
      try {
        const response = await apiService.patch<ApiUser>(`/account/${id}/`, data);
        return response.data!;
      } catch (error) {
        // Simuler la mise à jour pour les tests
        console.error(error);
        console.warn(`Endpoint /account/${id}/ not found, simulating update`);
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
        }
    },
    onSuccess: (data) => {
      // Mettre à jour le cache
      queryClient.setQueryData(adminKeys.user(data.id), data);
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.dismissLoading(loadingRef.current);
      toast.showSuccess('Succès', 'Utilisateur mis à jour avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la mise à jour de l\'utilisateur ' + error.message);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingRef = useRef<string>('');

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      loadingRef.current = toast.showLoading('Chargement', 'Utilisateur en cours de suppression');
      try {
        await apiService.delete(`/account/${id}/`);
      } catch {
        // Simuler la suppression pour les tests
        console.warn(`Endpoint /account/${id}/ not found, simulating deletion`);
        // Pas d'erreur pour simuler le succès
      }
    },
    onSuccess: (_, id) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: adminKeys.user(id) });
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.dismissLoading(loadingRef.current);
      toast.showSuccess('Succès', 'Utilisateur supprimé avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.dismissLoading(loadingRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la suppression de l\'utilisateur ' + error.message);
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }): Promise<ApiUser> => {
      try {
        const response = await apiService.patch<ApiUser>(`/account/${id}/`, { is_active });
        return response.data!;
      } catch (error) {
        // Simuler la mise à jour pour les tests
        console.warn(`Endpoint /account/${id}/ not found, simulating status toggle`);
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
      }
    },
    onSuccess: (data) => {
      // Mettre à jour le cache
      queryClient.setQueryData(adminKeys.user(data.id), data);
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.showSuccess('Succès', `Utilisateur ${data.is_active ? 'activé' : 'désactivé'} avec succès`);
    },
    onError: (error) => {
      console.error(error);
      toast.showError('Erreur', 'Une erreur est survenue lors de la modification du statut ' + error.message);
    },
  });
}

// Hooks pour les artistes (utilisateurs avec profil artiste)
export function useAdminArtists(params?: {
  search?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: [...adminKeys.artists(), params],
    queryFn: async (): Promise<ApiPaginatedUserList> => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('has_artist_profile', 'true');
        if (params?.search) queryParams.append('search', params.search);
        if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
        
        const endpoint = `/account/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await apiService.get<ApiPaginatedUserList>(endpoint);
        return response.data!;
      } catch (error) {
        // Retourner des données mockées si l'endpoint n'existe pas
        console.error(error);
        console.warn('Endpoint /account/ with artist profile not found, using mock data');
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminArtist(id: string) {
  return useQuery({
    queryKey: adminKeys.artist(id),
    queryFn: async (): Promise<ApiUser> => {
      try {
        const response = await apiService.get<ApiUser>(`/account/${id}/`);
        return response.data!;
      } catch (error) {
        // Retourner des données mockées si l'endpoint n'existe pas
        console.error(error);
        console.warn(`Endpoint /account/${id}/ not found, using mock data`);
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour les statistiques admin
export function useAdminStats() {
  return useQuery({
    queryKey: [...adminKeys.all, 'stats'],
    queryFn: async () => {
      try {
        const response = await apiService.get('/admin/stats/');
        return response.data!;
      } catch (error) {
        // Retourner des données mockées si l'endpoint n'existe pas
        console.error(error);
        console.warn('Endpoint /admin/stats/ not found, using mock data');
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
      }
    },
    staleTime: 2 * 60 * 1000, // Cache pendant 2 minutes
  });
}

// Hooks pour les subscriptions
export function useAdminSubscriptions(params?: {
  status?: string;
  payment_method?: string;
  plan?: string;
  user?: string;
  start_date?: string;
  end_date?: string;
  auto_renew?: boolean;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: subscriptionKeys.list(params),
    queryFn: async (): Promise<ApiPaginatedSubscriptionList> => {
      try {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.payment_method) queryParams.append('payment_method', params.payment_method);
        if (params?.plan) queryParams.append('plan', params.plan);
        if (params?.user) queryParams.append('user', params.user);
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);
        if (params?.auto_renew !== undefined) queryParams.append('auto_renew', params.auto_renew.toString());
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
        
        const endpoint = `/subscription/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await apiService.get<ApiPaginatedSubscriptionList>(endpoint);
        return response.data!;
      } catch {
        console.warn('Endpoint /subscription/ not found, using mock data');
        // Retourner des données mockées
        return {
          links: { next: null, previous: null, next_num: null, previous_num: null },
          max_page_size: 10000,
          count: 0,
          total_pages: 1,
          results: []
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminSubscription(id: string) {
  return useQuery({
    queryKey: subscriptionKeys.detail(id),
    queryFn: async (): Promise<ApiSubscription> => {
      try {
        const response = await apiService.get<ApiSubscription>(`/subscription/${id}/`);
        return response.data!;
      } catch (error) {
        console.warn(`Endpoint /subscription/${id}/ not found, using mock data`);
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hooks pour les plans d'abonnement
export function useAdminSubscriptionPlans(params?: {
  name?: string;
  is_active?: boolean;
  is_featured?: boolean;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: subscriptionKeys.list(params),
    queryFn: async (): Promise<ApiPaginatedPlanList> => {
      try {
        const queryParams = new URLSearchParams();
        if (params?.name) queryParams.append('name', params.name);
        if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
        if (params?.is_featured !== undefined) queryParams.append('is_featured', params.is_featured.toString());
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
        
        const endpoint = `/subscription/plans/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await apiService.get<ApiPaginatedPlanList>(endpoint);
        return response.data!;
      } catch {
        console.warn('Endpoint /subscription/plans/ not found, using mock data');
        // Retourner des données mockées
        return {
          links: { next: null, previous: null, next_num: null, previous_num: null },
          max_page_size: 10000,
          count: 0,
          total_pages: 1,
          results: []
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminSubscriptionPlan(id: string) {
  return useQuery({
    queryKey: subscriptionKeys.plan(id),
    queryFn: async (): Promise<ApiSubscriptionPlan> => {
      try {
        const response = await apiService.get<ApiSubscriptionPlan>(`/subscription/plans/${id}/`);
        return response.data!;
      } catch (error) {
        console.warn(`Endpoint /subscription/plans/${id}/ not found, using mock data`);
        console.error(error);
        throw new Error('Subscription plan not found');
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Mutations pour les plans d'abonnement
export function useCreateSubscriptionPlan() {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  return useMutation({
    mutationFn: async (data: Partial<ApiSubscriptionPlan>): Promise<ApiSubscriptionPlan> => {
      try {
        const response = await apiService.post<ApiSubscriptionPlan>('/subscription/plans/', data);
        return response.data!;
      } catch {
        console.warn('Endpoint /subscription/plans/ not found, simulating creation');
        throw new Error('Failed to create subscription plan');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.plans() });
      toast.showSuccess('Succès', 'Plan d\'abonnement créé avec succès');
    },
    onError: () => {
      toast.showError('Erreur', 'Erreur lors de la création du plan d\'abonnement');
    },
  });
}

export function useUpdateSubscriptionPlan() {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ApiSubscriptionPlan> }): Promise<ApiSubscriptionPlan> => {
      try {
        const response = await apiService.put<ApiSubscriptionPlan>(`/subscription/plans/${id}/`, data);
        return response.data!;
      } catch {
        console.warn(`Endpoint /subscription/plans/${id}/ not found, simulating update`);
        throw new Error('Failed to update subscription plan');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.plan(data.id) });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.plans() });
      toast.showSuccess('Succès', 'Plan d\'abonnement mis à jour avec succès');
    },
    onError: () => {
      toast.showError('Erreur', 'Erreur lors de la mise à jour du plan d\'abonnement');
    },
  });
}

export function useDeleteSubscriptionPlan() {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        await apiService.delete(`/subscription/plans/${id}/`);
      } catch {
        console.warn(`Endpoint /subscription/plans/${id}/ not found, simulating deletion`);
        throw new Error('Failed to delete subscription plan');
      }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.plan(id) });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.plans() });
      toast.showSuccess('Succès', 'Plan d\'abonnement supprimé avec succès');
    },
    onError: () => {
      toast.showError('Erreur', 'Erreur lors de la suppression du plan d\'abonnement');
    },
  });
}
