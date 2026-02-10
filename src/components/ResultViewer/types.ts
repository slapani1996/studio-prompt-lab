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

export interface ResultViewerProps {
  results: RunResult[];
  onResultClick?: (result: RunResult) => void;
  selectedResultId?: string;
}
