"use client";

import { PromptEditor } from "../PromptEditor";
import { useChainBuilder } from "./useChainBuilder";
import { Button } from "@/components/ui/Button";
import type { ChainBuilderProps } from "./types";
import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Image,
  Plus,
} from "lucide-react";

export function ChainBuilder({ steps, onChange }: ChainBuilderProps) {
  const { addStep, updateStep, removeStep, moveStep } = useChainBuilder(
    steps,
    onChange,
  );

  return (
    <div className="space-y-4">
      {steps.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-zinc-300 p-8 text-center dark:border-[#4c566a]">
          <Image className="size-12 text-zinc-400 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-zinc-900 dark:text-[#eceff4]">
            No steps
          </h3>
          <p className="mt-1 text-zinc-500 dark:text-[#d8dee9]">
            Add a step to start building your prompt chain.
          </p>
          <Button
            onClick={addStep}
            icon={<Plus className="size-5" />}
            className="mt-4"
          >
            Add First Step
          </Button>
        </div>
      ) : (
        <>
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Card */}
              <div className="relative">
                {/* Move Buttons */}
                <div className="absolute -left-10 top-4 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveStep(index, "up")}
                    disabled={index === 0}
                    className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-30 dark:hover:bg-[#434c5e] dark:hover:text-zinc-400"
                  >
                    <ChevronUp className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStep(index, "down")}
                    disabled={index === steps.length - 1}
                    className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-30 dark:hover:bg-[#434c5e] dark:hover:text-zinc-400"
                  >
                    <ChevronDown className="size-5" />
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
                  <ArrowDown className="size-6 text-zinc-400" />
                </div>
              )}
            </div>
          ))}

          {/* Add Step Button */}
          <button
            type="button"
            onClick={addStep}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 py-4 text-zinc-500 transition-colors hover:border-violet-400 hover:text-violet-600 dark:border-[#4c566a] dark:hover:border-[#88c0d0] dark:hover:text-zinc-400"
          >
            <Plus className="size-5" /> Add Step
          </button>
        </>
      )}

      {/* Chain Preview */}
      {steps.length > 1 && (
        <div className="rounded-lg bg-zinc-50 p-4 dark:bg-[#434c5e]">
          <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
            Chain Flow
          </h4>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-violet-100 px-2 py-1 text-xs text-violet-700 dark:bg-[#5e81ac]/20 dark:text-[#88c0d0]">
              Input Images
            </span>
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <ArrowRight className="size-4 text-zinc-400" />
                <span className="rounded bg-zinc-200 px-2 py-1 text-xs text-zinc-700 dark:bg-[#4c566a] dark:text-[#e5e9f0]">
                  Step {index + 1}
                </span>
              </div>
            ))}
            <ArrowRight className="size-4 text-zinc-400" />
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
