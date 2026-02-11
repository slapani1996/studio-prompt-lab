import type { FormEvent } from "react";
import { PromptStep } from "@/components/PromptEditor";

export interface PromptTemplate {
  id: string;
  name: string;
  description: string | null;
  steps: PromptStep[];
  createdAt: string;
  updatedAt: string;
  _count?: { runs: number };
}

export interface UsePromptsPageReturn {
  templates: PromptTemplate[];
  loading: boolean;
  showModal: boolean;
  editingTemplate: PromptTemplate | null;
  name: string;
  description: string;
  steps: PromptStep[];
  saving: boolean;
  searchQuery: string;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setSteps: (steps: PromptStep[]) => void;
  setSearchQuery: (query: string) => void;
  openCreateModal: () => void;
  openEditModal: (template: PromptTemplate) => void;
  closeModal: () => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  duplicateTemplate: (template: PromptTemplate) => void;
}
