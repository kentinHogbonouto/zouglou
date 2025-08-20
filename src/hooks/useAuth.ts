import { useAuth as useAuthQuery } from './useAuthQueries';

// Fonctions utilitaires pour gérer l'ID utilisateur
export const getCurrentUserId = (): string | null => {
  return localStorage.getItem('current_user_id');
};

export const setCurrentUserId = (userId: string): void => {
  localStorage.setItem('current_user_id', userId);
};

export const clearCurrentUserId = (): void => {
  localStorage.removeItem('current_user_id');
};

export const isUserAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token') && !!localStorage.getItem('current_user_id');
};

// Hook principal d'authentification avec fonctions utilitaires
export function useAuth() {
  const auth = useAuthQuery();
  
  return {
    ...auth,
    // Fonctions utilitaires
    getCurrentUserId,
    setCurrentUserId,
    clearCurrentUserId,
    isUserAuthenticated,
  };
} 