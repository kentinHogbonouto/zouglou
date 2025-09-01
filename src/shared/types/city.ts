export interface AdminCity {
  id: string;
  name: string;
  status: boolean;
  logo: string | null;
  longitude: string | null;
  latitude: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCityCreateRequest {
  name: string;
  status: boolean;
  logo?: File | null;
  longitude?: string | null;
  latitude?: string | null;
}

export interface AdminCityUpdateRequest {
  name?: string;
  status?: boolean;
  logo?: File | null;
  longitude?: string | null;
  latitude?: string | null;
}

export type AdminCityListResponse = AdminCity[];
