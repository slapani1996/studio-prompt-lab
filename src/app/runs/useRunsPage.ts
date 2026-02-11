import { useState, useEffect, useCallback } from "react";
import type { FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type {
  InputSet,
  Template,
  Run,
  UseRunsPageReturn,
} from "./types";

export type { UseRunsPageReturn } from "./types";

export function useRunsPage(): UseRunsPageReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [runs, setRuns] = useState<Run[]>([]);
  const [inputSets, setInputSets] = useState<InputSet[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(
    searchParams.get("new") === "true"
  );

  const [selectedInputSet, setSelectedInputSet] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [executing, setExecuting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);

      const [runsRes, inputSetsRes, templatesRes] = await Promise.all([
        fetch(`/api/runs?${params}`),
        fetch("/api/inputs"),
        fetch("/api/prompts"),
      ]);

      const [runsData, inputSetsData, templatesData] = await Promise.all([
        runsRes.json(),
        inputSetsRes.json(),
        templatesRes.json(),
      ]);

      setRuns(runsData);
      setInputSets(inputSetsData);
      setTemplates(templatesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = useCallback(() => {
    setShowModal(true);
    router.replace("/runs", { scroll: false });
  }, [router]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedInputSet("");
    setSelectedTemplate("");
    router.replace("/runs", { scroll: false });
  }, [router]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!selectedInputSet || !selectedTemplate) {
        toast.error("Please select an input set and template");
        return;
      }

      setExecuting(true);

      try {
        const createRes = await fetch("/api/runs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inputSetId: selectedInputSet,
            templateId: selectedTemplate,
          }),
        });

        if (!createRes.ok) {
          throw new Error("Failed to create run");
        }

        const run = await createRes.json();

        const executeRes = await fetch(`/api/runs/${run.id}/execute`, {
          method: "POST",
        });

        if (!executeRes.ok) {
          throw new Error("Failed to execute run");
        }

        await fetchData();
        closeModal();
        toast.success("Run started successfully");
        router.push(`/runs/${run.id}`);
      } catch {
        toast.error("Failed to start run");
      } finally {
        setExecuting(false);
      }
    },
    [selectedInputSet, selectedTemplate, fetchData, closeModal, router]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this run?")) return;

      try {
        const response = await fetch(`/api/runs/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete run");
        }

        await fetchData();
        toast.success("Run deleted");
      } catch {
        toast.error("Failed to delete run");
      }
    },
    [fetchData]
  );

  return {
    runs,
    inputSets,
    templates,
    loading,
    showModal,
    selectedInputSet,
    selectedTemplate,
    executing,
    statusFilter,
    openModal,
    closeModal,
    setSelectedInputSet,
    setSelectedTemplate,
    setStatusFilter,
    handleSubmit,
    handleDelete,
  };
}
