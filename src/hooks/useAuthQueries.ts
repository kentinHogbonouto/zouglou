"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { User } from '@/shared/types';
import { useToast } from '@/components/providers/ToastProvider';
import {useRef} from 'react';

// Utility function to safely access localStorage (prevents SSR errors)
const getLocalStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorage = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const removeLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

// Types pour les requêtes d'authentification
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends Partial<User> {
  password: string;
}

interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

// Types pour la mise à jour du profil
interface UpdateUserProfileData {
  full_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  birth_date?: string;
  sexe?: string;
  adress?: string;
  countryCode?: string;
}

interface UpdateArtistProfileData {
  id: string;
  stage_name?: string;
  biography?: string;
  profile_image?: File;
  cover_image?: File;
}

interface ChangePasswordData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

// Clés de cache pour React Query
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  userById: (id: string) => [...authKeys.all, 'user', id] as const,
  login: () => [...authKeys.all, 'login'] as const,
  register: () => [...authKeys.all, 'register'] as const,
  logout: () => [...authKeys.all, 'logout'] as const,
  forgotPassword: () => [...authKeys.all, 'forgotPassword'] as const,
  resetPassword: () => [...authKeys.all, 'resetPassword'] as const,
};

// Hook pour récupérer l'utilisateur connecté
export function useUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async (): Promise<User | null> => {
      const token = getLocalStorage('auth_token');
      if (!token) {
        return null;
      }

      try {
        const response = await apiService.get<AuthResponse>(`/account/${getLocalStorage('current_user_id')}`);
        const user = response?.data || null;
        return user as unknown as User;
      } catch (error) {
        console.error("error", error)
        removeLocalStorage('auth_token');
        removeLocalStorage('current_user_id');
        return null;
      }
    },
    // Ne pas refetch automatiquement si pas de token
    enabled: !!getLocalStorage('auth_token'),
    // Cache pendant 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}

// Hook pour récupérer un utilisateur par son ID
export function useUserById(id: string) {
  return useQuery({
    queryKey: authKeys.userById(id),
    queryFn: async (): Promise<User | null> => {
      if (!id) {
        return null;
      }

      try {
        const response = await apiService.get<User>(`/account/${id}/`);
        return response.data || null;
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return null;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Cache pendant 5 minutes
  });
}

// Hook pour récupérer l'utilisateur connecté par son ID (depuis le localStorage)
export function useCurrentUserById() {
  const userId = getLocalStorage('current_user_id');
  return useUserById(userId || '');
}

// Hook pour la connexion
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await apiService.post<AuthResponse>('/account/login/', credentials);
      
      return response.data!;
    },
    onSuccess: (data) => {
      // Sauvegarder le token
      setLocalStorage('auth_token', data.access_token);
      setLocalStorage('refresh_token', data.refresh_token);
      
      // Sauvegarder l'ID de l'utilisateur connecté
      setLocalStorage('current_user_id', data.user.id);
      
      // Mettre à jour le cache avec les données utilisateur
      queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.setQueryData(authKeys.userById(data.user.id), data.user);
      
      // Invalider les autres requêtes d'authentification
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error: unknown) => {
      console.error('Erreur de connexion:', error);
      throw error;
    },
  });
}

// Hook pour l'inscription
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: RegisterData): Promise<AuthResponse> => {
      const response = await apiService.post<AuthResponse>('/account/', userData);
      return response.data!;
    },
    onSuccess: (data) => {
      // Sauvegarder le token
      setLocalStorage('auth_token', data.access_token);
      setLocalStorage('refresh_token', data.refresh_token);
      
      // Sauvegarder l'ID de l'utilisateur connecté
      setLocalStorage('current_user_id', data?.user?.id);
      
      // Mettre à jour le cache avec les données utilisateur
      queryClient.setQueryData(authKeys.user(), data?.user);
      queryClient.setQueryData(authKeys.userById(data?.user?.id), data?.user);
      
      // Invalider les autres requêtes d'authentification
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error: unknown) => {
      console.error('Erreur d\'inscription:', error);
      throw error;
    },
  });
}

// Hook pour la déconnexion
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
    },
    onSuccess: () => {
      // Supprimer le token et l'ID utilisateur
      removeLocalStorage('auth_token');
      removeLocalStorage('refresh_token');
      removeLocalStorage('current_user_id');
      
      // Vider le cache utilisateur
      queryClient.setQueryData(authKeys.user(), null);
      
      // Invalider toutes les requêtes d'authentification
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      
      queryClient.clear();

      if (typeof window !== 'undefined') {
        window.location.href = '/';
      } 

    },
   
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (emailOrPhone: string): Promise<void> => {
      await apiService.post('/account/request_reset_password/', { emailOrPhone });
    },
    onSuccess: () => {
    },
    onError: (error: unknown) => {
      throw error;
    },
  });
}

export function useResetPassword() {

  return useMutation({
    mutationFn: async (data: { token: string, newPassword: string }): Promise<void> => {
      await apiService.post('/account/reset_password/', data);
    },
    onSuccess: () => {
    },
    onError: (error: unknown) => {
      console.error('Erreur de réinitialisation de mot de passe:', error);
      throw error;
    },
  });
}

// Hook pour mettre à jour le profil utilisateur
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingUpdateUserProfileRef = useRef<string>('');
  return useMutation({
    mutationFn: async (data: UpdateUserProfileData): Promise<User> => {
      loadingUpdateUserProfileRef.current = toast.showLoading('Chargement', 'Mise à jour du profil utilisateur en cours');
      const response = await apiService.patch<User>(`/account/${getLocalStorage('current_user_id')}/`, data);
      return response.data!;
    },
    onSuccess: (updatedUser) => {
      // Mettre à jour le cache utilisateur
      queryClient.setQueryData(authKeys.user(), updatedUser);
      queryClient.setQueryData(authKeys.userById(updatedUser.id), updatedUser);
      
      // Invalider les requêtes liées à l'utilisateur
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      queryClient.invalidateQueries({ queryKey: authKeys.userById(updatedUser.id) });
      toast.dismissLoading(loadingUpdateUserProfileRef.current);
      toast.showSuccess('Succès', 'Profil utilisateur mis à jour avec succès');
    },
    onError: (error: unknown) => {
      console.error('Erreur lors de la mise à jour du profil utilisateur:', error);
      toast.dismissLoading(loadingUpdateUserProfileRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la mise à jour du profil utilisateur ');
      throw error;
    },
  });
}

// Hook pour mettre à jour le profil artiste
export function useUpdateArtistProfile() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const loadingUpdateArtistProfileRef = useRef<string>('');
  return useMutation({
    mutationFn: async (data: UpdateArtistProfileData): Promise<User> => {
      loadingUpdateArtistProfileRef.current = toast.showLoading('Chargement', 'Mise à jour du profil artiste en cours');
      const formData = new FormData();
      
      if (data.stage_name) formData.append('stage_name', data.stage_name);
      if (data.biography) formData.append('biography', data.biography);
      if (data.profile_image) formData.append('profile_image', data.profile_image);
      if (data.cover_image) formData.append('cover_image', data.cover_image);

      const response = await apiService.patch<User>(`/artist/${data.id}/`, formData);
      return response.data!;
    },
    onSuccess: (updatedUser) => {
      // Mettre à jour le cache utilisateur
      queryClient.setQueryData(authKeys.user(), updatedUser);
      queryClient.setQueryData(authKeys.userById(updatedUser.id), updatedUser);
      
      // Invalider les requêtes liées à l'utilisateur
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      queryClient.invalidateQueries({ queryKey: authKeys.userById(updatedUser.id) });
      toast.dismissLoading(loadingUpdateArtistProfileRef.current);
      toast.showSuccess('Succès', 'Profil artiste mis à jour avec succès');
    },
    onError: (error: unknown) => {
      console.error('Erreur lors de la mise à jour du profil artiste:', error);
      toast.dismissLoading(loadingUpdateArtistProfileRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors de la mise à jour du profil artiste ');
      throw error;
    },
  });
}

// Hook pour changer le mot de passe
export function useChangePassword() {
  const toast = useToast();
  const loadingChangePasswordRef = useRef<string>('');
  return useMutation({
    mutationFn: async (data: ChangePasswordData): Promise<void> => {
      if (data.new_password !== data.confirm_password) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      loadingChangePasswordRef.current = toast.showLoading('Chargement', 'Changement de mot de passe en cours');
      await apiService.put(`/account/${getLocalStorage('current_user_id')}/set_password/`, {
        old_password: data.old_password,
        new_password: data.new_password,
      });
    },
    onSuccess: () => {
      toast.dismissLoading(loadingChangePasswordRef.current);
      toast.showSuccess('Succès', 'Mot de passe changé avec succès');
    },
    onError: (error: unknown) => {
      console.error('Erreur lors du changement de mot de passe:', error);
      toast.dismissLoading(loadingChangePasswordRef.current);
      toast.showError('Erreur', 'Une erreur est survenue lors du changement de mot de passe ');
      throw error;
    },
  });
}

// Hook pour vérifier l'authentification
export function useAuth() {
  const { data: user, isLoading, error } = useUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();
  const updateUserProfileMutation = useUpdateUserProfile();
  const updateArtistProfileMutation = useUpdateArtistProfile();
  const changePasswordMutation = useChangePassword();
  
  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    updateUserProfile: updateUserProfileMutation.mutateAsync,
    updateArtistProfile: updateArtistProfileMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isForgotPassword: forgotPasswordMutation.isPending,
    isUpdatingUserProfile: updateUserProfileMutation.isPending,
    isUpdatingArtistProfile: updateArtistProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
  };
} 