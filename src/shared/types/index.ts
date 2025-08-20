import { Artist, User } from './user';

// Types utilisateur
export * from './user';

// Types existants
export interface Track {
  id: string;
  title: string;
  artistId: string;
  artist: Artist;
  albumId?: string;
  album?: Album;
  duration: number; // en secondes
  genre: string[];
  tags: string[];
  coverUrl: string;
  audioUrl: string;
  isExplicit: boolean;
  isPublic: boolean;
  playCount: number;
  likeCount: number;
  shareCount: number;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artist: Artist;
  description?: string;
  coverUrl: string;
  genre: string[];
  tracks: Track[];
  totalDuration: number;
  isPublic: boolean;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  userId: string;
  user: User;
  coverUrl?: string;
  tracks: Track[];
  isPublic: boolean;
  isCollaborative: boolean;
  followers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stream {
  id: string;
  userId: string;
  user: User;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  streamUrl: string;
  isLive: boolean;
  viewerCount: number;
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  id: string;
  userId: string;
  trackId?: string;
  albumId?: string;
  type: 'play' | 'like' | 'share' | 'download' | 'stream';
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface Revenue {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: 'streaming' | 'download' | 'subscription' | 'donation';
  status: 'pending' | 'paid' | 'failed';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: Date;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'track_uploaded' | 'new_follower' | 'playlist_added' | 'revenue_earned' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  results?: T[];
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  results?: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 

// Export des types API
export * from './api'; 