'use client';

import { AVAILABLE_MODELS, ASPECT_RATIOS, IMAGE_SIZES } from '@/types';
import type { PromptStep, PromptEditorProps } from './types';

export function PromptEditor({
  step,
  onChange,
  onRemove,
  stepNumber,
  showRemove = false,
}: PromptEditorProps) {
  const updateField = <K extends keyof PromptStep>(field: K, value: PromptStep[K]) => {
    onChange({ ...step, [field]: value });
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-[#4c566a] dark:bg-[#3b4252]">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-medium text-zinc-900 dark:text-[#eceff4]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-sm text-violet-600 dark:bg-[#5e81ac]/20 dark:text-[#88c0d0]">
            {stepNumber}
          </span>
          Step {stepNumber}
        </h4>
        {showRemove && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-rose-500 hover:text-rose-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        )}
      </div>

      {/* Prompt Text */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
          Prompt
        </label>
        <textarea
          value={step.prompt}
          onChange={(e) => updateField('prompt', e.target.value)}
          rows={4}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-[#4c566a] dark:bg-[#434c5e] dark:text-[#eceff4]"
          placeholder="Enter your prompt here. Use {{image}} to reference input images and {{product}} for product context..."
        />
        <p className="mt-1 text-xs text-zinc-500">
          Available variables: {'{{image}}'}, {'{{product}}'}, {'{{previous_output}}'}
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Model */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
            Model
          </label>
          <select
            value={step.model}
            onChange={(e) => updateField('model', e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-[#4c566a] dark:bg-[#434c5e] dark:text-[#eceff4]"
          >
            {AVAILABLE_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {/* Aspect Ratio */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
            Aspect Ratio
          </label>
          <select
            value={step.aspectRatio}
            onChange={(e) => updateField('aspectRatio', e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-[#4c566a] dark:bg-[#434c5e] dark:text-[#eceff4]"
          >
            {ASPECT_RATIOS.map((ratio) => (
              <option key={ratio.id} value={ratio.id}>
                {ratio.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Size */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
            Image Size
          </label>
          <select
            value={step.imageSize}
            onChange={(e) => updateField('imageSize', e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-[#4c566a] dark:bg-[#434c5e] dark:text-[#eceff4]"
          >
            {IMAGE_SIZES.map((size) => (
              <option key={size.id} value={size.id}>
                {size.name}
              </option>
            ))}
          </select>
        </div>

        {/* Temperature */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
            Temperature: {step.temperature.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={step.temperature}
            onChange={(e) => updateField('temperature', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default PromptEditor;
