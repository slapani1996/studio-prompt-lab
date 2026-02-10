import type { PromptStep } from '../PromptEditor/types';

export type { PromptStep };

export interface ChainBuilderProps {
  steps: PromptStep[];
  onChange: (steps: PromptStep[]) => void;
}

export interface UseChainBuilderReturn {
  addStep: () => void;
  updateStep: (index: number, updatedStep: PromptStep) => void;
  removeStep: (index: number) => void;
  moveStep: (index: number, direction: 'up' | 'down') => void;
}
