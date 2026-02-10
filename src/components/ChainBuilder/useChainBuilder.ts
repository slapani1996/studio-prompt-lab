import { useCallback } from 'react';
import { DEFAULT_MODEL, DEFAULT_ASPECT_RATIO, DEFAULT_IMAGE_SIZE, DEFAULT_TEMPERATURE } from '@/lib/constants';
import type { PromptStep, UseChainBuilderReturn } from './types';

export function useChainBuilder(
  steps: PromptStep[],
  onChange: (steps: PromptStep[]) => void
): UseChainBuilderReturn {
  const addStep = useCallback(() => {
    const newStep: PromptStep = {
      order: steps.length,
      prompt: '',
      model: DEFAULT_MODEL,
      aspectRatio: DEFAULT_ASPECT_RATIO,
      imageSize: DEFAULT_IMAGE_SIZE,
      temperature: DEFAULT_TEMPERATURE,
    };
    onChange([...steps, newStep]);
  }, [steps, onChange]);

  const updateStep = useCallback((index: number, updatedStep: PromptStep) => {
    const newSteps = [...steps];
    newSteps[index] = updatedStep;
    onChange(newSteps);
  }, [steps, onChange]);

  const removeStep = useCallback((index: number) => {
    const newSteps = steps.filter((_, i) => i !== index).map((step, i) => ({
      ...step,
      order: i,
    }));
    onChange(newSteps);
  }, [steps, onChange]);

  const moveStep = useCallback((index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];

    onChange(newSteps.map((step, i) => ({ ...step, order: i })));
  }, [steps, onChange]);

  return {
    addStep,
    updateStep,
    removeStep,
    moveStep,
  };
}
