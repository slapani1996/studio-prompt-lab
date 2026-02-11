"use client";

import { useState } from "react";
import type { ResultViewerProps, RunResult } from "./types";
import { Button } from "@/components/ui/Button";
import { CircleCheck, Image, Star, X } from "lucide-react";

export function ResultViewer({
  results,
  onResultClick,
  selectedResultId,
}: ResultViewerProps) {
  const [viewMode, setViewMode] = useState<"grid" | "compare">("grid");
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
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 dark:border-[#4c566a]">
        <div className="text-center">
          <Image className="size-12 text-zinc-400 mx-auto" />
          <p className="mt-2 text-zinc-500 dark:text-[#d8dee9]">
            No results yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "ghost" : "text"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-violet-100 text-violet-700 dark:bg-[#5e81ac]/20 dark:text-[#88c0d0]" : ""}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === "compare" ? "ghost" : "text"}
            size="sm"
            onClick={() => setViewMode("compare")}
            className={viewMode === "compare" ? "bg-violet-100 text-violet-700 dark:bg-[#5e81ac]/20 dark:text-[#88c0d0]" : ""}
          >
            Compare ({compareResults.length}/4)
          </Button>
        </div>
        {viewMode === "compare" && compareResults.length > 0 && (
          <Button
            variant="text"
            size="sm"
            onClick={() => setCompareResults([])}
            className="text-rose-600 hover:text-rose-700 dark:text-rose-400"
          >
            Clear Selection
          </Button>
        )}
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => {
            const metadata = getMetadata(result);
            const tags = getTags(result);

            return (
              <div
                key={result.id}
                className={`overflow-hidden rounded-lg border bg-white shadow-sm transition-all dark:bg-[#3b4252] ${
                  selectedResultId === result.id
                    ? "border-[#88c0d0] ring-2 ring-[#88c0d0]/30 dark:ring-[#88c0d0]/30"
                    : "border-zinc-200 hover:shadow-lg hover:shadow-violet-500/10 dark:border-[#4c566a]"
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
                    <div className="flex aspect-square items-center justify-center bg-zinc-100 dark:bg-[#434c5e]">
                      <span className="text-sm text-zinc-500">No image</span>
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
                          ? "bg-violet-500 text-white"
                          : "bg-black/50 text-white hover:bg-black/70"
                      }`}
                    >
                      <CircleCheck className="size-5" />
                    </button>
                  </div>

                  {/* Rating Badge */}
                  {result.rating && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/50 px-2 py-1">
                      <Star className="size-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm text-white">
                        {result.rating}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-900 dark:text-[#eceff4]">
                      Step {result.stepOrder + 1}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {metadata.aspectRatio || "1:1"}
                    </span>
                  </div>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-[#434c5e] dark:text-[#d8dee9]"
                        >
                          {tag}
                        </span>
                      ))}
                      {tags.length > 3 && (
                        <span className="text-xs text-zinc-500">
                          +{tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Error */}
                  {metadata.error && (
                    <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
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
      {viewMode === "compare" && (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.min(compareResults.length || 1, 2)}, 1fr)`,
          }}
        >
          {compareResults.length === 0 ? (
            <div className="col-span-full flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 dark:border-[#4c566a]">
              <p className="text-zinc-500 dark:text-[#d8dee9] text-center">
                Click the checkbox on images to add them to comparison
              </p>
            </div>
          ) : (
            compareResults.map((resultId) => {
              const result = results.find((r) => r.id === resultId);
              if (!result) return null;

              const metadata = getMetadata(result);

              return (
                <div
                  key={result.id}
                  className="overflow-hidden rounded-lg border border-zinc-200 dark:border-[#4c566a]"
                >
                  <div className="relative">
                    <img
                      src={result.outputImage}
                      alt={`Step ${result.stepOrder + 1} output`}
                      className="w-full"
                    />
                    <button
                      onClick={() => toggleCompare(result.id)}
                      className="absolute right-2 top-2 rounded bg-rose-500 p-1 text-white hover:bg-rose-600"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="bg-white p-3 dark:bg-[#3b4252]">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-zinc-900 dark:text-[#eceff4]">
                        Step {result.stepOrder + 1}
                      </span>
                      {result.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="size-4 text-amber-400 fill-amber-400" />
                          <span className="text-sm">{result.rating}/5</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
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

export default ResultViewer;
