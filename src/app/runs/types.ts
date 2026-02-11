import type { FormEvent } from "react";

export interface InputSet {
  id: string;
  name: string;
}

export interface Template {
  id: string;
  name: string;
}

export interface RunResult {
  id: string;
  stepOrder: number;
  outputImage: string;
  rating: number | null;
}

export interface Run {
  id: string;
  inputSetId: string;
  templateId: string;
  status: string;
  error: string | null;
  inputSet: InputSet;
  template: Template;
  results: RunResult[];
  createdAt: string;
}

export interface UseRunsPageReturn {
  runs: Run[];
  inputSets: InputSet[];
  templates: Template[];
  loading: boolean;
  showModal: boolean;
  selectedInputSet: string;
  selectedTemplate: string;
  executing: boolean;
  statusFilter: string;
  searchQuery: string;
  openModal: () => void;
  closeModal: () => void;
  setSelectedInputSet: (id: string) => void;
  setSelectedTemplate: (id: string) => void;
  setStatusFilter: (status: string) => void;
  setSearchQuery: (query: string) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
}
