"use client";

import { Suspense } from "react";
import ChainBuilder from "@/components/ChainBuilder";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { SearchInput } from "@/components/ui/SearchInput";
import { usePromptsPage } from "./usePromptsPage";
import { Copy, FileText, Pencil, Plus, Trash2 } from "lucide-react";

function PromptsContent() {
  const {
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
  } = usePromptsPage();

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
            Prompt Templates
          </h1>
          <p className="mt-1 lg:text-base text-sm text-zinc-600 dark:text-[#94969C]">
            Build and manage your image generation prompts
          </p>
        </div>
        <Button onClick={openCreateModal} icon={<Plus className="size-5" />}>
          New Template
        </Button>
      </div>

      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search templates..."
          className="max-w-md"
        />
      </div>

      {templates.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-zinc-300 p-12 text-center dark:border-[#333741]">
          <FileText className="size-12 text-zinc-400 mx-auto" />

          <h3 className="mt-2 text-lg font-medium text-zinc-900 dark:text-white">
            No templates
          </h3>
          <p className="mt-1 text-zinc-500 dark:text-[#94969C]">
            Create your first prompt template to get started.
          </p>
          <Button onClick={openCreateModal} className="mt-4">
            Create Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex flex-col justify-between overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-lg hover:shadow-violet-500/10 dark:border-[#333741] dark:bg-[#161B26]"
            >
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    {template.name}
                  </h3>
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700 dark:bg-[#7F56D9]/20 dark:text-[#9E77ED]">
                    {template.steps.length} step
                    {template.steps.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {template.description && (
                  <p className="mb-3 text-sm text-zinc-600 dark:text-[#94969C]">
                    {template.description}
                  </p>
                )}

                {/* Steps Preview */}
                <div className="mb-3 space-y-2">
                  {template.steps.slice(0, 2).map((step, index) => (
                    <div
                      key={index}
                      className="rounded bg-zinc-50 p-2 dark:bg-[#1F242F]"
                    >
                      <p className="text-xs text-zinc-700 dark:text-[#CECFD2]">
                        <span className="font-medium">Step {index + 1}:</span>{" "}
                        {step.prompt}
                      </p>
                      <div className="mt-1 flex gap-2 text-xs text-zinc-500">
                        <span>{step.aspectRatio}</span>
                        <span>|</span>
                        <span>{step.imageSize}</span>
                      </div>
                    </div>
                  ))}
                  {template.steps.length > 2 && (
                    <p className="text-center text-xs text-zinc-500">
                      +{template.steps.length - 2} more step
                      {template.steps.length - 2 !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>{template._count?.runs || 0} runs</span>
                  <span>
                    Updated {new Date(template.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex p-4 gap-4">
                <Button
                  variant="text"
                  size="sm"
                  onClick={() => openEditModal(template)}
                  icon={<Pencil className="size-4" />}
                  className="flex-1 bg-zinc-100 dark:bg-[#1F242F]"
                >
                  Edit
                </Button>
                <Button
                  variant="text"
                  size="sm"
                  onClick={() => duplicateTemplate(template)}
                  icon={<Copy className="size-4" />}
                  className="flex-1 bg-zinc-100 dark:bg-[#1F242F]"
                >
                  Duplicate
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(template.id)}
                  icon={<Trash2 className="size-4" />}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingTemplate ? "Edit Template" : "Create Template"}
        className="!max-w-5xl"
        scrollable
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="prompt-template-form"
              disabled={saving || !name || steps.length === 0}
              loading={saving}
            >
              {editingTemplate ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <form
          id="prompt-template-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Name */}
          <Input
            label="Template Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Kitchen Renovation Visualization"
          />

          {/* Description */}
          <Textarea
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Describe what this template does..."
          />

          {/* Steps */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-[#CECFD2]">
              Prompt Steps
            </label>
            <div className="pl-10">
              <ChainBuilder steps={steps} onChange={setSteps} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function PromptsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
        </div>
      }
    >
      <PromptsContent />
    </Suspense>
  );
}
