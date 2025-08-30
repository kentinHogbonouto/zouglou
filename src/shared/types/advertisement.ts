export type PlacementEnum = 'pre_roll' | 'mid_roll' | 'banner' | 'interstitial';

export interface Advertisement {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  audio_url?: string;
  click_url?: string;
  duration?: number;
  placement: PlacementEnum;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdvertisementResponse {
  links: {
    next: string | null;
    previous: string | null;
    next_num: number | null;
    previous_num: number | null;
  };
  max_page_size: number;
  count: number;
  total_pages: number;
  results: Advertisement[];
}

export interface AdvertisementFormData {
  title: string;
  description?: string;
  image_url?: File | null;
  audio_url?: File | null;
  click_url?: string;
  duration?: number;
  placement: PlacementEnum;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}
