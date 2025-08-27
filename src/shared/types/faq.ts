export interface Faq {
  id: string;
  question: string;
  content: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFaqRequest {
  question: string;
  content: string;
  position?: number;
}

export interface UpdateFaqRequest {
  question?: string;
  content?: string;
  position?: number;
}

export interface FaqFilters {
  search?: string;
  position?: number;
}

export interface FaqSortOptions {
  field: 'question' | 'position' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}
