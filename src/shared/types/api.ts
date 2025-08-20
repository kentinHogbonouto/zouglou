// Types API spécifiques pour Zouglouzik

// Types pour la musique
export interface ApiArtist {
  id: string;
  stage_name: string;
  cover?: string;
  bio?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSong {
  id: string;
  title: string;
  artist: ApiArtist;
  album?: ApiAlbum;
  genre?: ApiGenre;
  duration: number;
  file_url: string;
  cover?: string;
  audio_file: string;
  track_number?: number;
  count_likes?: number;
  play_count?: number;
  is_published: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAlbum {
  id: string;
  title: string;
  artist: ApiArtist;
  release_date?: string;
  category?: string;
  genre?: string;
  description?: string;
  cover?: string;
  total_tracks: number;
  total_duration: number;
  is_published: boolean;
  deleted: boolean;
  songs: ApiSong[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
}

export interface ApiGenre {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
}

// Types pour les notifications
export interface ApiNotification {
  id: string;
  user: string;
  title: string;
  message: string;
  is_read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  updatedAt: string;
}

// Types pour les postcards (si disponible)
export interface ApiPostcard {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Types pour les live streams
export interface ApiLiveStream {
  id: string;
  title: string;
  description?: string;
  artist: string;
  stream_url: string;
  is_live: boolean;
  started_at?: string;
  ended_at?: string;
  viewers_count: number;
  createdAt: string;
  updatedAt: string;
}

// Types pour les statistiques d'écoute
export interface ApiListenHistory {
  id: string;
  user: string;
  song: string;
  listened_at: string;
  duration: number;
}

// Types pour les réponses paginées de l'API
export interface ApiPaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export type ApiPaginatedSongList = ApiPaginatedResponse<ApiSong>;
export type ApiPaginatedAlbumList = ApiPaginatedResponse<ApiAlbum>;
export type ApiPaginatedNotificationList = ApiPaginatedResponse<ApiNotification>;
export type ApiPaginatedPostcardList = ApiPaginatedResponse<ApiPostcard>;
export type ApiPaginatedLiveStreamList = ApiPaginatedResponse<ApiLiveStream>;

// Types pour les formulaires
export interface CreateSongData {
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration?: number;
  track_number?: number;
  is_explicit?: boolean;
  audio_file: File;
  is_published?: boolean;
  cover_image?: File;
}

export interface UpdateSongData {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
  duration?: number;
  track_number?: number;
  is_explicit?: boolean;
  audio_file?: File;
  is_published?: boolean;
  cover_image?: File;
}

export interface CreateAlbumData {
  title: string;
  release_date?: string;
  description?: string;
  is_published?: boolean;
  cover_image?: File;
  category?: string;
  genre?: string;
  artist: string;
}

export interface UpdateAlbumData {
  title?: string;
  release_date?: string;
  description?: string;
  is_published?: boolean;
  cover_image?: File;
  category?: string;
  genre?: string;
}

export interface CreateLiveStreamData {
  title: string;
  description?: string;
  stream_url: string;
  artist: string;
  start_time?: string;
  duration?: number;
  is_published?: boolean;
}

export interface UpdateLiveStreamData {
  title?: string;
  description?: string;
  stream_url?: string;
  is_live?: boolean;
}

// Types pour les podcasts
export interface ApiPodcast {
  id: string;
  title: string;
  description: string;
  cover: string;
  artist: string;
  genre: string;
  is_published: boolean;
  episodes_count: number;
  subscribers_count: number;
  createdAt: string;
  updatedAt: string;
  episodes?: ApiPodcastEpisode[];
}

export interface ApiPodcastEpisode {
  id: string;
  title: string;
  description: string;
  file: string;
  duration: number;
  podcast: string;
  episode_number: number;
  release_date: string;
  is_in_user_favorites: string;
  last_listening_history?: ApiListeningHistory;
  count_likes: number;
  play_count: number;
  unique_listeners?: number;
  is_published: boolean;
  cover?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiListeningHistory {
  id: string;
  user: string;
  episode: string;
  started_at: string;
  last_position: number;
  total_listened: number;
  completed: boolean;
  completed_at: string;
  createdAt: string;
  updatedAt: string;
}

// Types pour les réponses paginées des podcasts
export type ApiPaginatedPodcastList = ApiPaginatedResponse<ApiPodcast>;
export type ApiPaginatedPodcastEpisodeList = ApiPaginatedResponse<ApiPodcastEpisode>;

// Types pour les formulaires de podcasts
export interface CreatePodcastData {
  title: string;
  description: string;
  cover?: File;
  artist: string;
  genre: string;
  is_published?: boolean;
}

export interface UpdatePodcastData {
  title?: string;
  description?: string;
  cover?: File;
  artist?: string;
  genre?: string;
  is_published?: boolean;
}

export interface CreatePodcastEpisodeData {
  title: string;
  description: string;
  file: File;
  duration: number;
  podcast: string;
  episode_number: number;
  release_date: string;
  is_published?: boolean;
}

export interface UpdatePodcastEpisodeData {
  title?: string;
  description?: string;
  file?: File;
  duration?: number;
  podcast?: string;
  episode_number?: number;
  release_date?: string;
  is_published?: boolean;
  cover_image?: File;
  audio_file?: File;
} 