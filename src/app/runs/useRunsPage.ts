import { useState, useEffect, useCallback, useMemo } from "react";
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
  const [allRuns, setAllRuns] = useState<Run[]>([]);
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

      setAllRuns(runsData);
      setInputSets(inputSetsData);
      setTemplates(templatesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const runs = useMemo(() => {
    if (!searchQuery.trim()) return allRuns;
    const query = searchQuery.toLowerCase();
    return allRuns.filter(
      (run) =>
        run.inputSet.name.toLowerCase().includes(query) ||
        run.template.name.toLowerCase().includes(query)
    );
  }, [allRuns, searchQuery]);

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

  const handleDelete = useCallback((id: string) => {
    setDeleteTargetId(id);
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTargetId) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/runs/${deleteTargetId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete run");
      }

      await fetchData();
      toast.success("Run deleted");
      setShowDeleteDialog(false);
      setDeleteTargetId(null);
    } catch {
      toast.error("Failed to delete run");
    } finally {
      setDeleting(false);
    }
  }, [deleteTargetId, fetchData]);

  const closeDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
    setDeleteTargetId(null);
  }, []);

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
    searchQuery,
    showDeleteDialog,
    deleting,
    openModal,
    closeModal,
    setSelectedInputSet,
    setSelectedTemplate,
    setStatusFilter,
    setSearchQuery,
    handleSubmit,
    handleDelete,
    confirmDelete,
    closeDeleteDialog,
  };
}
