export interface Information {
  id: string;
  privacy_policy: string;
  terms_of_use: string;
  about_us: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInformationRequest {
  privacy_policy: string;
  terms_of_use: string;
  about_us: string;
}

export interface UpdateInformationRequest {
  privacy_policy?: string;
  terms_of_use?: string;
  about_us?: string;
}

export interface InformationFilters {
  search?: string;
}

export interface InformationSortOptions {
  field: 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}
