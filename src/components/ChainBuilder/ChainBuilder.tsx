'use client';

import { PromptEditor } from '../PromptEditor';
import { useChainBuilder } from './useChainBuilder';
import type { ChainBuilderProps } from './types';

export function ChainBuilder({ steps, onChange }: ChainBuilderProps) {
  const { addStep, updateStep, removeStep, moveStep } = useChainBuilder(steps, onChange);

  return (
    <div className="space-y-4">
      {steps.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-zinc-300 p-8 text-center dark:border-[#4c566a]">
          <svg
            className="mx-auto h-12 w-12 text-zinc-400"
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
          <h3 className="mt-2 text-lg font-medium text-zinc-900 dark:text-[#eceff4]">No steps</h3>
          <p className="mt-1 text-zinc-500 dark:text-[#d8dee9]">
            Add a step to start building your prompt chain.
          </p>
          <button
            type="button"
            onClick={addStep}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
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
                <div className="absolute -top-4 left-8 h-4 w-0.5 bg-zinc-300 dark:bg-[#4c566a]" />
              )}

              {/* Step Card */}
              <div className="relative">
                {/* Move Buttons */}
                <div className="absolute -left-10 top-4 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveStep(index, 'up')}
                    disabled={index === 0}
                    className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-30 dark:hover:bg-[#434c5e]"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStep(index, 'down')}
                    disabled={index === steps.length - 1}
                    className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-30 dark:hover:bg-[#434c5e]"
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
                  <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 py-4 text-zinc-500 transition-colors hover:border-violet-400 hover:text-violet-600 dark:border-[#4c566a] dark:hover:border-[#88c0d0]"
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
        <div className="rounded-lg bg-zinc-50 p-4 dark:bg-[#434c5e]">
          <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">Chain Flow</h4>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-violet-100 px-2 py-1 text-xs text-violet-700 dark:bg-[#5e81ac]/20 dark:text-[#88c0d0]">
              Input Images
            </span>
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                <span className="rounded bg-zinc-200 px-2 py-1 text-xs text-zinc-700 dark:bg-[#4c566a] dark:text-[#e5e9f0]">
                  Step {index + 1}
                </span>
              </div>
            ))}
            <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <span className="rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              Final Output
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChainBuilder;
