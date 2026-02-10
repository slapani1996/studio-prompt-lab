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
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600 dark:bg-blue-900 dark:text-blue-400">
            {stepNumber}
          </span>
          Step {stepNumber}
        </h4>
        {showRemove && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        )}
      </div>

      {/* Prompt Text */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Prompt
        </label>
        <textarea
          value={step.prompt}
          onChange={(e) => updateField('prompt', e.target.value)}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Enter your prompt here. Use {{image}} to reference input images and {{product}} for product context..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Available variables: {'{{image}}'}, {'{{product}}'}, {'{{previous_output}}'}
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Model */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Model
          </label>
          <select
            value={step.model}
            onChange={(e) => updateField('model', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Aspect Ratio
          </label>
          <select
            value={step.aspectRatio}
            onChange={(e) => updateField('aspectRatio', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image Size
          </label>
          <select
            value={step.imageSize}
            onChange={(e) => updateField('imageSize', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
