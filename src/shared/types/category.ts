export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreateRequest {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

export interface CategoryUpdateRequest {
  name?: string;
  slug?: string;
  description?: string;
  is_active?: boolean;
}

export interface CategoryListResponse {
  links: {
    next: string | null;
    previous: string | null;
    next_num: number | null;
    previous_num: number | null;
  };
  max_page_size: number;
  count: number;
  total_pages: number;
  results: Category[];
}
