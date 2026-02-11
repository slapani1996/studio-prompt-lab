"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import ResultViewer from "@/components/ResultViewer";
import ReviewPanel from "@/components/ReviewPanel";
import { Button } from "@/components/ui/Button";
import { getStatusColor } from "@/lib/utils";
import { ArrowLeft, Play, RefreshCcw, Trash2 } from "lucide-react";

interface Image {
  id: string;
  filename: string;
  path: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  imageUrl: string | null;
}

interface PromptStep {
  id: string;
  order: number;
  prompt: string;
  model: string;
  aspectRatio: string;
  imageSize: string;
}

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

interface Run {
  id: string;
  status: string;
  error: string | null;
  inputSet: {
    id: string;
    name: string;
    images: Image[];
    products: Product[];
  };
  template: {
    id: string;
    name: string;
    steps: PromptStep[];
  };
  results: RunResult[];
  createdAt: string;
}

export default function RunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [run, setRun] = useState<Run | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<RunResult | null>(null);
  const [rerunning, setRerunning] = useState(false);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    fetchRun();
  }, [id]);

  const fetchRun = async () => {
    try {
      const response = await fetch(`/api/runs/${id}`);
      if (!response.ok) {
        throw new Error("Run not found");
      }
      const data = await response.json();
      setRun(data);

      if (data.results.length > 0 && !selectedResult) {
        setSelectedResult(data.results[0]);
      }
    } catch (error) {
      console.error("Failed to fetch run:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!run) return;

    setExecuting(true);

    try {
      const response = await fetch(`/api/runs/${run.id}/execute`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to execute run");
      }

      await fetchRun();
      toast.success("Run executed successfully");
    } catch {
      toast.error("Failed to execute run");
    } finally {
      setExecuting(false);
    }
  };

  const handleRerun = async () => {
    if (!run) return;

    setRerunning(true);

    try {
      // Create a new run with same settings
      const createRes = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputSetId: run.inputSet.id,
          templateId: run.template.id,
        }),
      });

      if (!createRes.ok) {
        throw new Error("Failed to create run");
      }

      const newRun = await createRes.json();

      // Execute the new run
      await fetch(`/api/runs/${newRun.id}/execute`, {
        method: "POST",
      });

      toast.success("Re-run started");
      router.push(`/runs/${newRun.id}`);
    } catch {
      toast.error("Failed to re-run");
    } finally {
      setRerunning(false);
    }
  };

  const handleDelete = async () => {
    if (!run || !confirm("Are you sure you want to delete this run?")) return;

    try {
      const response = await fetch(`/api/runs/${run.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete run");
      }

      toast.success("Run deleted");
      router.push("/runs");
    } catch {
      toast.error("Failed to delete run");
    }
  };

  const handleResultUpdate = async () => {
    await fetchRun();
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-[#eceff4]">
          Run not found
        </h2>
        <Link
          href="/runs"
          className="mt-4 text-violet-600 hover:text-violet-700 dark:text-[#88c0d0]"
        >
          Back to runs
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto md:p-8 p-4">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-col lg:flex-row gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/runs"
              className="text-zinc-500 hover:text-zinc-700 dark:text-[#d8dee9]"
            >
              <ArrowLeft />
            </Link>
            <h1 className="lg:text-2xl text-xl font-bold text-zinc-900 dark:text-[#eceff4]">
              Run Details
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(run.status)}`}
            >
              {run.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-[#d8dee9]">
            ID: {run.id} | Created: {new Date(run.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {run.status === "pending" && (
            <Button
              onClick={handleExecute}
              disabled={executing}
              loading={executing}
              icon={!executing ? <Play className="size-4" /> : undefined}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {executing ? "Executing..." : "Execute"}
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={handleRerun}
            disabled={rerunning}
            loading={rerunning}
            icon={!rerunning ? <RefreshCcw className="size-4" /> : undefined}
          >
            {rerunning ? "Re-running..." : "Re-run"}
          </Button>
          <Button
            variant="secondary"
            onClick={handleDelete}
            icon={<Trash2 className="size-4" />}
            className="border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-400 dark:hover:bg-rose-900/20"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {run.error && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4 dark:border-[#bf616a] dark:bg-[#bf616a]/20">
          <p className="text-sm text-rose-700 dark:text-rose-400">
            {run.error}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Run Info & Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Set & Template Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-[#4c566a] dark:bg-[#3b4252]">
              <h3 className="text-sm font-medium text-zinc-500 dark:text-[#d8dee9]">
                Input Set
              </h3>
              <p className="mt-1 font-semibold text-zinc-900 dark:text-[#eceff4]">
                {run.inputSet.name}
              </p>
              <div className="mt-2 flex gap-2 text-xs text-zinc-500">
                <span>{run.inputSet.images.length} images</span>
                <span>|</span>
                <span>{run.inputSet.products.length} products</span>
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-[#4c566a] dark:bg-[#3b4252]">
              <h3 className="text-sm font-medium text-zinc-500 dark:text-[#d8dee9]">
                Template
              </h3>
              <p className="mt-1 font-semibold text-zinc-900 dark:text-[#eceff4]">
                {run.template.name}
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                {run.template.steps.length} steps
              </p>
            </div>
          </div>

          {/* Input Images Preview */}
          {run.inputSet.images.length > 0 && (
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-[#4c566a] dark:bg-[#3b4252]">
              <h3 className="mb-3 font-medium text-zinc-900 dark:text-[#eceff4]">
                Input Images
              </h3>
              <div className="flex gap-2 overflow-x-auto">
                {run.inputSet.images.map((image) => (
                  <img
                    key={image.id}
                    src={image.path}
                    alt={image.filename}
                    className="h-20 w-20 flex-shrink-0 rounded object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-[#4c566a] dark:bg-[#3b4252]">
            <h3 className="mb-4 font-medium text-zinc-900 dark:text-[#eceff4]">
              Generated Results ({run.results.length})
            </h3>
            <ResultViewer
              results={run.results}
              onResultClick={setSelectedResult}
              selectedResultId={selectedResult?.id}
            />
          </div>

          {/* Prompt Steps */}
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-[#4c566a] dark:bg-[#3b4252]">
            <h3 className="mb-4 font-medium text-zinc-900 dark:text-[#eceff4]">
              Prompt Steps
            </h3>
            <div className="space-y-3">
              {run.template.steps.map((step, index) => {
                const result = run.results.find(
                  (r) => r.stepOrder === step.order,
                );
                const hasError =
                  result && JSON.parse(result.metadata || "{}").error;

                return (
                  <div
                    key={step.id}
                    className={`rounded-lg border p-3 ${
                      hasError
                        ? "border-rose-200 bg-rose-50 dark:border-[#bf616a] dark:bg-[#bf616a]/20"
                        : "border-zinc-100 bg-zinc-50 dark:border-[#4c566a] dark:bg-[#434c5e]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-900 dark:text-[#eceff4]">
                        Step {index + 1}
                      </span>
                      <div className="flex gap-2 text-xs text-zinc-500">
                        <span>{step.aspectRatio}</span>
                        <span>|</span>
                        <span>{step.imageSize}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-[#d8dee9]">
                      {step.prompt}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Review Panel */}
        <div className="lg:col-span-1">
          {selectedResult ? (
            <ReviewPanel
              result={selectedResult}
              onUpdate={handleResultUpdate}
            />
          ) : (
            <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-zinc-500 dark:text-[#d8dee9]">
                Select a result to review
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
