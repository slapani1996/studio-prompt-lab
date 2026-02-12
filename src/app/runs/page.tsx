"use client";

import { Suspense } from "react";
import Link from "next/link";
import { getStatusColor } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Dropdown } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { AIGenerationLoader } from "@/components/ui/AIGenerationLoader";
import {
  PaginatedTable,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { useRunsPage } from "./useRunsPage";
import { Clock3, Play, Trash2 } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "running", label: "Running" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

function RunsContent() {
  const {
    runs,
    inputSets,
    templates,
    loading,
    showModal,
    selectedInputSet,
    selectedTemplate,
    executing,
    showAILoader,
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
  } = useRunsPage();

  const inputSetOptions = [
    { value: "", label: "Select an input set..." },
    ...inputSets.map((s) => ({ value: s.id, label: s.name })),
  ];

  const templateOptions = [
    { value: "", label: "Select a template..." },
    ...templates.map((t) => ({ value: t.id, label: t.name })),
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="md:p-8 p-4 h-full overflow-auto">
      <div className="mb-4 flex lg:items-center items-start justify-between flex-col lg:flex-row gap-4">
        <div>
          <h1 className="lg:text-3xl text-2xl font-bold text-zinc-900 dark:text-white">
            Run History
          </h1>
          <p className="mt-1 lg:text-base text-sm text-zinc-600 dark:text-[#94969C]">
            View and manage your image generation runs
          </p>
        </div>
        <Button
          onClick={openModal}
          disabled={inputSets.length === 0 || templates.length === 0}
          icon={<Play className="size-4" />}
        >
          New Run
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search runs..."
          className="w-full sm:w-auto sm:min-w-[280px]"
        />
        <Dropdown
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
          ariaLabel="Filter by status"
          className="w-full sm:w-auto sm:min-w-[180px]"
        />
      </div>

      <PaginatedTable
        data={runs}
        columns={[
          { header: "Run" },
          { header: "Input Set" },
          { header: "Template" },
          { header: "Status" },
          { header: "Results" },
          { header: "Created" },
          { header: "Actions", align: "center" },
        ]}
        pageSize={10}
        emptyMessage={
          <div className="rounded-lg border-2 border-dashed border-zinc-300 p-12 text-center dark:border-[#333741]">
            <Clock3 className="size-12 text-zinc-400 mx-auto" />
            <h3 className="mt-2 text-lg font-medium text-zinc-900 dark:text-white">
              No runs yet
            </h3>
            <p className="mt-1 text-zinc-500 dark:text-[#94969C]">
              {inputSets.length === 0 || templates.length === 0
                ? "Create an input set and template first."
                : "Start a new run to generate images."}
            </p>
            {inputSets.length > 0 && templates.length > 0 && (
              <Button onClick={openModal} className="mt-4">
                Start New Run
              </Button>
            )}
          </div>
        }
        renderRow={(run) => (
          <TableRow key={run.id}>
            <TableCell>
              <Link
                href={`/runs/${run.id}`}
                className="font-medium text-violet-600 hover:text-violet-700 dark:text-[#9E77ED] dark:hover:text-[#9E77ED]"
              >
                {run.id}
              </Link>
            </TableCell>
            <TableCell>{run.inputSet.name}</TableCell>
            <TableCell>{run.template.name}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-150 hover:scale-105 hover:shadow-sm ${getStatusColor(run.status)}`}
              >
                {run.status}
              </span>
            </TableCell>
            <TableCell>
              {run.results.length} image
              {run.results.length !== 1 ? "s" : ""}
            </TableCell>
            <TableCell className="text-zinc-500 dark:text-[#94969C]">
              {new Date(run.createdAt).toLocaleString()}
            </TableCell>
            <TableCell align="center">
              <button
                onClick={() => handleDelete(run.id)}
                className="text-rose-600 hover:text-rose-700 dark:text-rose-400"
              >
                <Trash2 className="size-5" />
              </button>
            </TableCell>
          </TableRow>
        )}
      />

      {/* New Run Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Start New Run"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="new-run-form"
              disabled={executing || !selectedInputSet || !selectedTemplate}
              loading={executing}
              icon={!executing ? <Play className="size-4" /> : undefined}
            >
              {executing ? "Running..." : "Start Run"}
            </Button>
          </>
        }
      >
        <form id="new-run-form" onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-[#CECFD2]">
              Input Set
            </label>
            <div className="mt-1">
              <Dropdown
                options={inputSetOptions}
                value={selectedInputSet}
                onChange={setSelectedInputSet}
                ariaLabel="Select input set"
                buttonClassName="rounded-md focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                menuClassName="rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-[#CECFD2]">
              Prompt Template
            </label>
            <div className="mt-1">
              <Dropdown
                options={templateOptions}
                value={selectedTemplate}
                onChange={setSelectedTemplate}
                ariaLabel="Select prompt template"
                buttonClassName="rounded-md focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                menuClassName="rounded-md"
              />
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Run"
        message="Are you sure you want to delete this run? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />

      <AIGenerationLoader isVisible={showAILoader} />
    </div>
  );
}

export default function RunsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
        </div>
      }
    >
      <RunsContent />
    </Suspense>
  );
}
