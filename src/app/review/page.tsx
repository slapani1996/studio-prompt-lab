'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ReviewPanel from '@/components/ReviewPanel';

interface RunResult {
  id: string;
  stepOrder: number;
  outputImage: string;
  metadata: string;
  rating: number | null;
  notes: string | null;
  tags: string;
  createdAt: string;
  run: {
    id: string;
    inputSet: { id: string; name: string };
    template: { id: string; name: string };
  };
}

export default function ReviewPage() {
  const [results, setResults] = useState<RunResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<RunResult | null>(null);

  // Filters
  const [minRating, setMinRating] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('');

  useEffect(() => {
    fetchResults();
  }, [minRating, filterTag]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (minRating) params.set('minRating', minRating);
      if (filterTag) params.set('tags', filterTag);

      const response = await fetch(`/api/results?${params}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTags = (result: RunResult): string[] => {
    try {
      return JSON.parse(result.tags) || [];
    } catch {
      return [];
    }
  };

  // Get all unique tags from results
  const allTags = Array.from(
    new Set(results.flatMap((r) => getTags(r)))
  ).sort();

  // Statistics
  const totalResults = results.length;
  const ratedResults = results.filter((r) => r.rating !== null);
  const avgRating = ratedResults.length > 0
    ? (ratedResults.reduce((sum, r) => sum + (r.rating || 0), 0) / ratedResults.length).toFixed(1)
    : '0.0';
  const topRated = results.filter((r) => r.rating && r.rating >= 4).length;

  return (
    <div className="h-full overflow-auto p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Review Results</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Browse, filter, and annotate your generated images
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/api/export?format=json"
            download
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export JSON
          </a>
          <a
            href="/api/export?format=csv"
            download
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Results</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalResults}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Rated</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{ratedResults.length}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Rating</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgRating}/5</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Top Rated (4+)</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{topRated}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Min Rating
          </label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All ratings</option>
            <option value="1">1+ stars</option>
            <option value="2">2+ stars</option>
            <option value="3">3+ stars</option>
            <option value="4">4+ stars</option>
            <option value="5">5 stars only</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Tag
          </label>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {(minRating || filterTag) && (
          <div className="flex items-end">
            <button
              onClick={() => {
                setMinRating('');
                setFilterTag('');
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
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
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No results found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {minRating || filterTag
              ? 'Try adjusting your filters.'
              : 'Run some prompts to generate images.'}
          </p>
          {!minRating && !filterTag && (
            <Link
              href="/runs?new=true"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Start a Run
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Results Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {results.map((result) => {
                const tags = getTags(result);

                return (
                  <div
                    key={result.id}
                    onClick={() => setSelectedResult(result)}
                    className={`cursor-pointer overflow-hidden rounded-lg border bg-white transition-all dark:bg-gray-800 ${
                      selectedResult?.id === result.id
                        ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                        : 'border-gray-200 hover:shadow-md dark:border-gray-700'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative aspect-square">
                      {result.outputImage ? (
                        <img
                          src={result.outputImage}
                          alt="Generated result"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-700">
                          <span className="text-xs text-gray-500">No image</span>
                        </div>
                      )}

                      {/* Rating Badge */}
                      {result.rating && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5">
                          <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-xs text-white">{result.rating}</span>
                        </div>
                      )}

                      {/* Tags Badge */}
                      {tags.length > 0 && (
                        <div className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5">
                          <span className="text-xs text-white">{tags.length} tags</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-2">
                      <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                        {result.run.inputSet.name}
                      </p>
                      <Link
                        href={`/runs/${result.run.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        View Run
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Panel */}
          <div className="lg:col-span-1">
            {selectedResult ? (
              <ReviewPanel result={selectedResult} onUpdate={fetchResults} />
            ) : (
              <div className="sticky top-8 rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
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
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Select an image to review
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
