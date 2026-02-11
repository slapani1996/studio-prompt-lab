import { useState, useEffect, useCallback, useMemo } from "react";
import type { FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PromptStep } from "@/components/PromptEditor";
import {
  DEFAULT_MODEL,
  DEFAULT_ASPECT_RATIO,
  DEFAULT_IMAGE_SIZE,
  DEFAULT_TEMPERATURE,
} from "@/lib/constants";
import type { PromptTemplate, UsePromptsPageReturn } from "./types";

export type { UsePromptsPageReturn } from "./types";

export function usePromptsPage(): UsePromptsPageReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allTemplates, setAllTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(
    searchParams.get("new") === "true"
  );
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(
    null
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<PromptStep[]>([
    {
      order: 0,
      prompt: "",
      model: DEFAULT_MODEL,
      aspectRatio: DEFAULT_ASPECT_RATIO,
      imageSize: DEFAULT_IMAGE_SIZE,
      temperature: DEFAULT_TEMPERATURE,
    },
  ]);
  const [saving, setSaving] = useState(false);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await fetch("/api/prompts");
      const data = await response.json();
      setAllTemplates(data);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const templates = useMemo(() => {
    if (!searchQuery.trim()) return allTemplates;
    const query = searchQuery.toLowerCase();
    return allTemplates.filter(
      (template) =>
        template.name.toLowerCase().includes(query) ||
        template.description?.toLowerCase().includes(query)
    );
  }, [allTemplates, searchQuery]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const resetForm = useCallback(() => {
    setName("");
    setDescription("");
    setSteps([
      {
        order: 0,
        prompt: "",
        model: DEFAULT_MODEL,
        aspectRatio: DEFAULT_ASPECT_RATIO,
        imageSize: DEFAULT_IMAGE_SIZE,
        temperature: DEFAULT_TEMPERATURE,
      },
    ]);
    setEditingTemplate(null);
  }, []);

  const openCreateModal = useCallback(() => {
    resetForm();
    setShowModal(true);
    router.replace("/prompts", { scroll: false });
  }, [resetForm, router]);

  const openEditModal = useCallback((template: PromptTemplate) => {
    setEditingTemplate(template);
    setName(template.name);
    setDescription(template.description || "");
    setSteps(template.steps);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    resetForm();
    router.replace("/prompts", { scroll: false });
  }, [resetForm, router]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (steps.length === 0 || steps.some((s) => !s.prompt.trim())) {
        toast.error("Please add at least one step with a prompt");
        return;
      }

      setSaving(true);

      try {
        const payload = {
          name,
          description: description || null,
          steps,
        };

        const url = editingTemplate
          ? `/api/prompts/${editingTemplate.id}`
          : "/api/prompts";
        const method = editingTemplate ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to save template");
        }

        await fetchTemplates();
        closeModal();
        toast.success(
          editingTemplate ? "Template updated" : "Template created"
        );
      } catch {
        toast.error("Failed to save template");
      } finally {
        setSaving(false);
      }
    },
    [name, description, steps, editingTemplate, fetchTemplates, closeModal]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this template?")) return;

      try {
        const response = await fetch(`/api/prompts/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete template");
        }

        await fetchTemplates();
        toast.success("Template deleted");
      } catch {
        toast.error("Failed to delete template");
      }
    },
    [fetchTemplates]
  );

  const duplicateTemplate = useCallback((template: PromptTemplate) => {
    setEditingTemplate(null);
    setName(`${template.name} (Copy)`);
    setDescription(template.description || "");
    setSteps(template.steps.map((s) => ({ ...s, id: undefined })));
    setShowModal(true);
  }, []);

  return {
    templates,
    loading,
    showModal,
    editingTemplate,
    name,
    description,
    steps,
    saving,
    searchQuery,
    setName,
    setDescription,
    setSteps,
    setSearchQuery,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
    duplicateTemplate,
  };
}
