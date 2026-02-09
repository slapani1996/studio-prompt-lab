'use client';

import PromptEditor, { PromptStep } from './PromptEditor';
import { DEFAULT_MODEL, DEFAULT_ASPECT_RATIO, DEFAULT_IMAGE_SIZE, DEFAULT_TEMPERATURE } from '@/lib/constants';

interface ChainBuilderProps {
  steps: PromptStep[];
  onChange: (steps: PromptStep[]) => void;
}

export default function ChainBuilder({ steps, onChange }: ChainBuilderProps) {
  const addStep = () => {
    const newStep: PromptStep = {
      order: steps.length,
      prompt: '',
      model: DEFAULT_MODEL,
      aspectRatio: DEFAULT_ASPECT_RATIO,
      imageSize: DEFAULT_IMAGE_SIZE,
      temperature: DEFAULT_TEMPERATURE,
    };
    onChange([...steps, newStep]);
  };

  const updateStep = (index: number, updatedStep: PromptStep) => {
    const newSteps = [...steps];
    newSteps[index] = updatedStep;
    onChange(newSteps);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index).map((step, i) => ({
      ...step,
      order: i,
    }));
    onChange(newSteps);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];

    // Update order values
    onChange(newSteps.map((step, i) => ({ ...step, order: i })));
  };

  return (
    <div className="space-y-4">
      {steps.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No steps</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Add a step to start building your prompt chain.
          </p>
          <button
            type="button"
            onClick={addStep}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add First Step
          </button>
        </div>
      ) : (
        <>
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index > 0 && (
                <div className="absolute -top-4 left-8 h-4 w-0.5 bg-gray-300 dark:bg-gray-600" />
              )}

              {/* Step Card */}
              <div className="relative">
                {/* Move Buttons */}
                <div className="absolute -left-10 top-4 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveStep(index, 'up')}
                    disabled={index === 0}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 dark:hover:bg-gray-700"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStep(index, 'down')}
                    disabled={index === steps.length - 1}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 dark:hover:bg-gray-700"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                </div>

                <PromptEditor
                  step={step}
                  onChange={(updatedStep) => updateStep(index, updatedStep)}
                  onRemove={() => removeStep(index)}
                  stepNumber={index + 1}
                  showRemove={steps.length > 1}
                />
              </div>

              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="flex justify-center py-2">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                  </svg>
                </div>
              )}
            </div>
          ))}

          {/* Add Step Button */}
          <button
            type="button"
            onClick={addStep}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-4 text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Step
          </button>
        </>
      )}

      {/* Chain Preview */}
      {steps.length > 1 && (
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Chain Flow</h4>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              Input Images
            </span>
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                <span className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  Step {index + 1}
                </span>
              </div>
            ))}
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Final Output
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
