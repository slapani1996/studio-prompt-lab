"use client";

import Link from "next/link";
import ReviewPanel from "@/components/ReviewPanel";
import { Dropdown } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { useReviewPage } from "./useReviewPage";
import { Download, Image, Star } from "lucide-react";

const RATING_OPTIONS = [
  { value: "", label: "All ratings" },
  { value: "1", label: "1+ stars" },
  { value: "2", label: "2+ stars" },
  { value: "3", label: "3+ stars" },
  { value: "4", label: "4+ stars" },
  { value: "5", label: "5 stars only" },
];

export default function ReviewPage() {
  const {
    results,
    loading,
    selectedResult,
    minRating,
    filterTag,
    allTags,
    totalResults,
    ratedResults,
    avgRating,
    topRated,
    setSelectedResult,
    setMinRating,
    setFilterTag,
    clearFilters,
    fetchResults,
    getTags,
  } = useReviewPage();

  const tagOptions = [
    { value: "", label: "All tags" },
    ...allTags.map((tag) => ({ value: tag, label: tag })),
  ];

  return (
    <div className="h-full overflow-auto md:p-8 p-4">
      <div className="mb-6 flex lg:items-center items-start justify-between flex-col lg:flex-row gap-4">
        <div>
          <h1 className="lg:text-3xl text-2xl font-bold text-zinc-900 dark:text-[#eceff4]">
            Review Results
          </h1>
          <p className="mt-1 lg:text-base text-sm text-zinc-600 dark:text-[#d8dee9]">
            Browse, filter, and annotate your generated images
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<Download className="size-4" />}
            onClick={() => (window.location.href = "/api/export?format=json")}
          >
            Export JSON
          </Button>
          <Button
            variant="secondary"
            icon={<Download className="size-4" />}
            onClick={() => (window.location.href = "/api/export?format=csv")}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-[#4c566a] dark:bg-[#3b4252]">
          <p className="text-sm text-zinc-500 dark:text-[#d8dee9]">
            Total Results
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-[#eceff4]">
            {totalResults}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-[#4c566a] dark:bg-[#3b4252]">
          <p className="text-sm text-zinc-500 dark:text-[#d8dee9]">Rated</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-[#eceff4]">
            {ratedResults.length}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-[#4c566a] dark:bg-[#3b4252]">
          <p className="text-sm text-zinc-500 dark:text-[#d8dee9]">
            Avg. Rating
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-[#eceff4]">
            {avgRating}/5
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-[#4c566a] dark:bg-[#3b4252]">
          <p className="text-sm text-zinc-500 dark:text-[#d8dee9]">
            Top Rated (4+)
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {topRated}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="w-full min-w-0 sm:w-auto sm:min-w-[180px]">
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
            Min Rating
          </label>
          <Dropdown
            options={RATING_OPTIONS}
            value={minRating}
            onChange={setMinRating}
            ariaLabel="Filter by minimum rating"
          />
        </div>

        <div className="w-full min-w-0 sm:w-auto sm:min-w-[180px]">
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
            Filter by Tag
          </label>
          <Dropdown
            options={tagOptions}
            value={filterTag}
            onChange={setFilterTag}
            ariaLabel="Filter by tag"
          />
        </div>

        {(minRating || filterTag) && (
          <div className="flex items-end">
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-zinc-300 p-12 text-center dark:border-[#4c566a]">
          <Image className="size-12 text-zinc-400 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-zinc-900 dark:text-[#eceff4]">
            No results found
          </h3>
          <p className="mt-1 text-zinc-500 dark:text-[#d8dee9]">
            {minRating || filterTag
              ? "Try adjusting your filters."
              : "Run some prompts to generate images."}
          </p>
          {!minRating && !filterTag && (
            <Link href="/runs?new=true">
              <Button className="mt-4">Start a Run</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Results Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((result) => {
                const tags = getTags(result);

                return (
                  <div
                    key={result.id}
                    onClick={() => setSelectedResult(result)}
                    className={`cursor-pointer overflow-hidden rounded-lg border bg-white transition-all dark:bg-[#3b4252] ${
                      selectedResult?.id === result.id
                        ? "border-[#88c0d0] ring-2 ring-[#88c0d0]/30 dark:ring-[#88c0d0]/30"
                        : "border-zinc-200 hover:shadow-lg hover:shadow-violet-500/10 dark:border-[#4c566a]"
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
                        <div className="flex h-full items-center justify-center bg-zinc-100 dark:bg-[#434c5e]">
                          <span className="text-xs text-zinc-500">
                            No image
                          </span>
                        </div>
                      )}

                      {/* Rating Badge */}
                      {result.rating && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-white">
                            {result.rating}
                          </span>
                        </div>
                      )}

                      {/* Tags Badge */}
                      {tags.length > 0 && (
                        <div className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5">
                          <span className="text-xs text-white">
                            {tags.length} tags
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-2">
                      <p className="truncate text-sm text-zinc-600 dark:text-[#d8dee9]">
                        {result.run.inputSet.name}
                      </p>
                      <Link
                        href={`/runs/${result.run.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-violet-600 hover:text-violet-700 dark:text-[#88c0d0] dark:hover:text-[#88c0d0]"
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
              <div className="sticky top-8 rounded-lg border border-zinc-200 bg-white p-6 text-center dark:border-[#4c566a] dark:bg-[#3b4252]">
                <Star className="mx-auto size-10 text-zinc-400" />
                <p className="mt-2 text-zinc-500 dark:text-[#d8dee9]">
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
