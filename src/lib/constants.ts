// Configuration de l'API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Configuration de l'application
export const APP_NAME = 'Zouglou';
export const APP_DESCRIPTION = 'Votre plateforme de santé en ligne';

// Configuration des routes
export const ROUTES = {
  HOME: '/',
  SERVICES: '/services',
  PACKS: '/packs',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

// Configuration des statuts
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
} as const;

// Configuration des rôles utilisateur
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
} as const; 