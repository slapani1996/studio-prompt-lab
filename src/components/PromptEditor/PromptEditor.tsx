"use client";

import { AVAILABLE_MODELS, ASPECT_RATIOS, IMAGE_SIZES } from "@/types";
import type { PromptStep, PromptEditorProps } from "./types";
import { Dropdown } from "@/components/ui/Dropdown";
import { Textarea } from "@/components/ui/Input";
import { Trash2 } from "lucide-react";

export function PromptEditor({
  step,
  onChange,
  onRemove,
  stepNumber,
  showRemove = false,
}: PromptEditorProps) {
  const updateField = <K extends keyof PromptStep>(
    field: K,
    value: PromptStep[K],
  ) => {
    onChange({ ...step, [field]: value });
  };

  const modelOptions = AVAILABLE_MODELS.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  const aspectRatioOptions = ASPECT_RATIOS.map((r) => ({
    value: r.id,
    label: r.name,
  }));

  const imageSizeOptions = IMAGE_SIZES.map((s) => ({
    value: s.id,
    label: s.name,
  }));

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
            <Trash2 className="size-5" />
          </button>
        )}
      </div>

      {/* Prompt Text */}
      <div className="mb-4">
        <Textarea
          label="Prompt"
          value={step.prompt}
          onChange={(e) => updateField("prompt", e.target.value)}
          rows={4}
          placeholder="Enter your prompt here. Use {{image}} to reference input images and {{product}} for product context..."
          helperText={`Available variables: {{image}}, {{product}}, {{previous_output}}`}
        />
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Model */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
            Model
          </label>
          <Dropdown
            options={modelOptions}
            value={step.model}
            onChange={(value) => updateField("model", value)}
            ariaLabel="Select model"
            buttonClassName="rounded-md focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            menuClassName="rounded-md"
          />
        </div>

        {/* Aspect Ratio */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
            Aspect Ratio
          </label>
          <Dropdown
            options={aspectRatioOptions}
            value={step.aspectRatio}
            onChange={(value) => updateField("aspectRatio", value)}
            ariaLabel="Select aspect ratio"
            buttonClassName="rounded-md focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            menuClassName="rounded-md"
          />
        </div>

        {/* Image Size */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
            Image Size
          </label>
          <Dropdown
            options={imageSizeOptions}
            value={step.imageSize}
            onChange={(value) => updateField("imageSize", value)}
            ariaLabel="Select image size"
            buttonClassName="rounded-md focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            menuClassName="rounded-md"
          />
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
            onChange={(e) =>
              updateField("temperature", parseFloat(e.target.value))
            }
            className="w-full accent-violet-600"
          />
        </div>
      </div>
    </div>
  );
}

export default PromptEditor;
