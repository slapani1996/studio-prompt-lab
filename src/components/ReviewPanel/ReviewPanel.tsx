"use client";

import { useReviewPanel } from "./useReviewPanel";
import { COMMON_TAGS } from "@/lib/constants";
import type { ReviewPanelProps } from "./types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Star, X } from "lucide-react";

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
    <div className="sticky top-8 space-y-5 rounded-lg border border-zinc-200 bg-white md:p-6 p-4 dark:border-[#333741] dark:bg-[#161B26]">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Preview Result
        </h3>
        <p className="text-sm text-zinc-500">Step {result.stepOrder + 1}</p>
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
      <div className="rounded bg-zinc-50 p-3 dark:bg-[#1F242F]">
        <h4 className="mb-2 text-xs font-medium uppercase text-zinc-500">
          Details
        </h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Model:</span>
            <span className="text-zinc-900 dark:text-white text-right">
              {(metadata.model as string) || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Aspect Ratio:</span>
            <span className="text-zinc-900 dark:text-white">
              {(metadata.aspectRatio as string) || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Created:</span>
            <span className="text-zinc-900 dark:text-white">
              {new Date(result.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-[#CECFD2]">
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
              <Star
                className={`h-8 w-8 ${rating && value <= rating
                    ? "text-amber-400 fill-amber-400"
                    : "text-zinc-300 fill-zinc-300 dark:text-[#333741] dark:fill-[#333741]"
                  }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-[#CECFD2]">
          Tags
        </label>

        {/* Current Tags */}
        {tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-1 text-xs text-violet-700 dark:bg-[#7F56D9]/20 dark:text-[#9E77ED]"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-violet-900 dark:hover:text-violet-200"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add New Tag */}
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag(newTag);
              }
            }}
            placeholder="Add tag..."
            className="flex-1 py-1.5 text-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addTag(newTag)}
            disabled={!newTag.trim()}
            className="bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-[#7F56D9]/20 dark:text-[#9E77ED]"
          >
            Add
          </Button>
        </div>

        {/* Common Tags */}
        <div className="mt-2">
          <p className="mb-1 text-xs text-zinc-500">Quick add:</p>
          <div className="flex flex-wrap gap-1">
            {COMMON_TAGS.filter((t) => !tags.includes(t))
              .slice(0, 6)
              .map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-200 dark:bg-[#1F242F] dark:text-[#94969C] dark:hover:bg-[#333741]"
                >
                  +{tag}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      <Textarea
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        placeholder="Add your notes about this result..."
        className="text-sm"
      />

      {/* Save Button */}
      <Button
        onClick={saveChanges}
        disabled={saving}
        loading={saving}
        fullWidth
      >
        {saved ? "Saved!" : "Save Review"}
      </Button>
    </div>
  );
}

export default ReviewPanel;
