import { City } from "./api";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  full_name?: string;
  username: string;
  avatar?: string;
  artist_profile?: ArtistProfile;
  bio?: string;
  role?: UserRole;
  default_role?: UserRole;
  status?: UserStatus;
  isVerified?: boolean;
  isEmailVerified?: boolean;
  is_verify_email?: boolean;
  is_active?: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Champs supplémentaires de l'API
  city?: City | null;
  interested_artists?: string[];
  birth_date?: string | null;
  sexe?: string | null;
  adress?: string | null;
  countryCode?: string | null;
  country?: string | null;
  country_name?: string | null;
  phone?: string;
  type_auth?: string;
  plateform?: string;
  hear_about?: string | null;
  user_count_notifcation?: number;
  is_superuser?: boolean;
  profil_image?: string | null;
}

export type UserRole = 'user' | 'artist' | 'admin' | 'super-admin';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'banned';

export interface ArtistProfile {
  id: string;
  stage_name: string;
  biography?: string | null;
  profile_image?: string | null;
  cover_image?: string | null;
  is_verified: boolean;
  followers_count: number;
  social_links?: Record<string, unknown> | null;
}

export interface Artist extends User {
  role: 'artist';
  id: string;
  artistName: string;
  genre: string[];
  followers: number;
  monthlyListeners: number;
  totalPlays: number;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export interface UserProfile extends User {
  phoneNumber?: string;
  dateOfBirth?: Date;
  country?: string;
  city?: City | null;
  timezone?: string;
  language?: string;
  preferences: UserPreferences;
  statistics: UserStatistics;
}

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  privacyLevel: 'public' | 'private' | 'friends';
  theme: 'light' | 'dark' | 'auto';
  autoplay: boolean;
  crossfade: boolean;
  audioQuality: 'low' | 'medium' | 'high';
}

export interface UserStatistics {
  totalPlays: number;
  totalLikes: number;
  totalShares: number;
  totalPlaylists: number;
  totalFollowers: number;
  totalFollowing: number;
  listeningTime: number; // en minutes
  favoriteGenres: string[];
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  avatar?: string;
  role?: UserRole;
  status?: UserStatus;
  isVerified?: boolean;
  isEmailVerified?: boolean;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  isVerified?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'createdAt' | 'lastLoginAt' | 'email' | 'firstName' | 'lastName';
  sortOrder?: 'asc' | 'desc';
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'login' | 'logout' | 'profile_update' | 'password_change' | 'role_change' | 'status_change';
  description: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  createdAt: Date;
  lastActivityAt: Date;
}

export interface UserReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: 'spam' | 'inappropriate_content' | 'harassment' | 'fake_account' | 'other';
  description: string;
  evidence?: string[];
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  moderatorId?: string;
  moderatorNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
} 