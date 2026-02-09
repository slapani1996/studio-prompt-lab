'use client';

import { useState } from 'react';

interface RunResult {
  id: string;
  stepOrder: number;
  outputImage: string;
  metadata: string;
  rating: number | null;
  notes: string | null;
  tags: string;
  createdAt: string;
}

interface ResultViewerProps {
  results: RunResult[];
  onResultClick?: (result: RunResult) => void;
  selectedResultId?: string;
}

export default function ResultViewer({
  results,
  onResultClick,
  selectedResultId,
}: ResultViewerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');
  const [compareResults, setCompareResults] = useState<string[]>([]);

  const toggleCompare = (resultId: string) => {
    setCompareResults((prev) => {
      if (prev.includes(resultId)) {
        return prev.filter((id) => id !== resultId);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, resultId];
    });
  };

  const getMetadata = (result: RunResult) => {
    try {
      return JSON.parse(result.metadata);
    } catch {
      return {};
    }
  };

  const getTags = (result: RunResult): string[] => {
    try {
      return JSON.parse(result.tags);
    } catch {
      return [];
    }
  };

  if (results.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        <div className="text-center">
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
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <p className="mt-2 text-gray-500 dark:text-gray-400">No results yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('compare')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              viewMode === 'compare'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            Compare ({compareResults.length}/4)
          </button>
        </div>
        {viewMode === 'compare' && compareResults.length > 0 && (
          <button
            onClick={() => setCompareResults([])}
            className="text-sm text-red-600 hover:text-red-800 dark:text-red-400"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => {
            const metadata = getMetadata(result);
            const tags = getTags(result);

            return (
              <div
                key={result.id}
                className={`overflow-hidden rounded-lg border bg-white shadow-sm transition-all dark:bg-gray-800 ${
                  selectedResultId === result.id
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                    : 'border-gray-200 hover:shadow-md dark:border-gray-700'
                }`}
              >
                {/* Image */}
                <div
                  className="relative cursor-pointer"
                  onClick={() => onResultClick?.(result)}
                >
                  {result.outputImage ? (
                    <img
                      src={result.outputImage}
                      alt={`Step ${result.stepOrder + 1} output`}
                      className="aspect-square w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-square items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <span className="text-sm text-gray-500">No image</span>
                    </div>
                  )}

                  {/* Compare Checkbox */}
                  <div className="absolute right-2 top-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompare(result.id);
                      }}
                      className={`rounded p-1 ${
                        compareResults.includes(result.id)
                          ? 'bg-blue-500 text-white'
                          : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Rating Badge */}
                  {result.rating && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/50 px-2 py-1">
                      <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-white">{result.rating}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Step {result.stepOrder + 1}
                    </span>
                    <span className="text-xs text-gray-500">
                      {metadata.aspectRatio || '1:1'}
                    </span>
                  </div>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                      {tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Error */}
                  {metadata.error && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                      {metadata.error}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compare View */}
      {viewMode === 'compare' && (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(compareResults.length || 1, 2)}, 1fr)` }}>
          {compareResults.length === 0 ? (
            <div className="col-span-full flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                Click the checkbox on images to add them to comparison
              </p>
            </div>
          ) : (
            compareResults.map((resultId) => {
              const result = results.find((r) => r.id === resultId);
              if (!result) return null;

              const metadata = getMetadata(result);

              return (
                <div key={result.id} className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <img
                      src={result.outputImage}
                      alt={`Step ${result.stepOrder + 1} output`}
                      className="w-full"
                    />
                    <button
                      onClick={() => toggleCompare(result.id)}
                      className="absolute right-2 top-2 rounded bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-white p-3 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Step {result.stepOrder + 1}
                      </span>
                      {result.rating && (
                        <div className="flex items-center gap-1">
                          <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm">{result.rating}/5</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {metadata.model} | {metadata.aspectRatio}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
