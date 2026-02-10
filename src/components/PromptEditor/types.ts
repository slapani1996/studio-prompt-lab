export interface PromptStep {
  id?: string;
  order: number;
  prompt: string;
  model: string;
  aspectRatio: string;
  imageSize: string;
  temperature: number;
}

export interface PromptEditorProps {
  step: PromptStep;
  onChange: (step: PromptStep) => void;
  onRemove?: () => void;
  stepNumber: number;
  showRemove?: boolean;
}
