export interface RunResult {
  id: string;
  stepOrder: number;
  outputImage: string;
  metadata: string;
  rating: number | null;
  notes: string | null;
  tags: string;
  createdAt: string;
}

export interface ReviewPanelProps {
  result: RunResult;
  onUpdate?: () => void;
}

export interface UseReviewPanelReturn {
  rating: number | null;
  notes: string;
  tags: string[];
  newTag: string;
  saving: boolean;
  saved: boolean;
  metadata: Record<string, unknown>;
  setNotes: (notes: string) => void;
  setNewTag: (tag: string) => void;
  handleRatingClick: (value: number) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  saveChanges: () => Promise<void>;
}
