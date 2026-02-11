export interface RunResult {
  id: string;
  stepOrder: number;
  outputImage: string;
  metadata: string;
  rating: number | null;
  notes: string | null;
  tags: string;
  createdAt: string;
  run: {
    id: string;
    inputSet: { id: string; name: string };
    template: { id: string; name: string };
  };
}

export interface UseReviewPageReturn {
  results: RunResult[];
  loading: boolean;
  selectedResult: RunResult | null;
  minRating: string;
  filterTag: string;
  allTags: string[];
  totalResults: number;
  ratedResults: RunResult[];
  avgRating: string;
  topRated: number;
  setSelectedResult: (result: RunResult | null) => void;
  setMinRating: (rating: string) => void;
  setFilterTag: (tag: string) => void;
  clearFilters: () => void;
  fetchResults: () => Promise<void>;
  getTags: (result: RunResult) => string[];
}
