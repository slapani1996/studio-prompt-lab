'use client';

import { useReviewPanel } from './useReviewPanel';
import { COMMON_TAGS } from '@/lib/constants';
import type { ReviewPanelProps } from './types';

export function ReviewPanel({ result, onUpdate }: ReviewPanelProps) {
  const {
    rating,
    notes,
    tags,
    newTag,
    saving,
    saved,
    metadata,
    setNotes,
    setNewTag,
    handleRatingClick,
    addTag,
    removeTag,
    saveChanges,
  } = useReviewPanel(result, onUpdate);

  return (
    <div className="sticky top-8 space-y-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Review Result
        </h3>
        <p className="text-sm text-gray-500">Step {result.stepOrder + 1}</p>
      </div>

      {/* Large Image Preview */}
      {result.outputImage && (
        <div className="overflow-hidden rounded-lg">
          <img
            src={result.outputImage}
            alt={`Step ${result.stepOrder + 1} output`}
            className="w-full"
          />
        </div>
      )}

      {/* Metadata */}
      <div className="rounded bg-gray-50 p-3 dark:bg-gray-900">
        <h4 className="mb-2 text-xs font-medium uppercase text-gray-500">Details</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Model:</span>
            <span className="text-gray-900 dark:text-white">{(metadata.model as string) || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Aspect Ratio:</span>
            <span className="text-gray-900 dark:text-white">{(metadata.aspectRatio as string) || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Created:</span>
            <span className="text-gray-900 dark:text-white">
              {new Date(result.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleRatingClick(value)}
              className="p-1 transition-transform hover:scale-110"
            >
              <svg
                className={`h-8 w-8 ${
                  rating && value <= rating
                    ? 'text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags
        </label>

        {/* Current Tags */}
        {tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-blue-900 dark:hover:text-blue-200"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add New Tag */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag(newTag);
              }
            }}
            placeholder="Add tag..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="button"
            onClick={() => addTag(newTag)}
            disabled={!newTag.trim()}
            className="rounded-md bg-blue-100 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-200 disabled:opacity-50 dark:bg-blue-900/30 dark:text-blue-400"
          >
            Add
          </button>
        </div>

        {/* Common Tags */}
        <div className="mt-2">
          <p className="mb-1 text-xs text-gray-500">Quick add:</p>
          <div className="flex flex-wrap gap-1">
            {COMMON_TAGS.filter((t) => !tags.includes(t)).slice(0, 6).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
              >
                +{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Add your notes about this result..."
        />
      </div>

      {/* Save Button */}
      <button
        onClick={saveChanges}
        disabled={saving}
        className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Review'}
      </button>
    </div>
  );
}

export default ReviewPanel;
