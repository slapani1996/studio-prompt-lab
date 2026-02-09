'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ChainBuilder from '@/components/ChainBuilder';
import { PromptStep } from '@/components/PromptEditor';
import { DEFAULT_MODEL, DEFAULT_ASPECT_RATIO, DEFAULT_IMAGE_SIZE, DEFAULT_TEMPERATURE } from '@/lib/constants';

interface PromptTemplate {
  id: string;
  name: string;
  description: string | null;
  steps: PromptStep[];
  createdAt: string;
  updatedAt: string;
  _count?: { runs: number };
}

function PromptsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(searchParams.get('new') === 'true');
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<PromptStep[]>([
    {
      order: 0,
      prompt: '',
      model: DEFAULT_MODEL,
      aspectRatio: DEFAULT_ASPECT_RATIO,
      imageSize: DEFAULT_IMAGE_SIZE,
      temperature: DEFAULT_TEMPERATURE,
    },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/prompts');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setSteps([
      {
        order: 0,
        prompt: '',
        model: DEFAULT_MODEL,
        aspectRatio: DEFAULT_ASPECT_RATIO,
        imageSize: DEFAULT_IMAGE_SIZE,
        temperature: DEFAULT_TEMPERATURE,
      },
    ]);
    setEditingTemplate(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
    router.replace('/prompts', { scroll: false });
  };

  const openEditModal = (template: PromptTemplate) => {
    setEditingTemplate(template);
    setName(template.name);
    setDescription(template.description || '');
    setSteps(template.steps);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
    router.replace('/prompts', { scroll: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (steps.length === 0 || steps.some((s) => !s.prompt.trim())) {
      toast.error('Please add at least one step with a prompt');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name,
        description: description || null,
        steps,
      };

      const url = editingTemplate ? `/api/prompts/${editingTemplate.id}` : '/api/prompts';
      const method = editingTemplate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save template');
      }

      await fetchTemplates();
      closeModal();
      toast.success(editingTemplate ? 'Template updated' : 'Template created');
    } catch {
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }

      await fetchTemplates();
      toast.success('Template deleted');
    } catch {
      toast.error('Failed to delete template');
    }
  };

  const duplicateTemplate = (template: PromptTemplate) => {
    setEditingTemplate(null);
    setName(`${template.name} (Copy)`);
    setDescription(template.description || '');
    setSteps(template.steps.map((s) => ({ ...s, id: undefined })));
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prompt Templates</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Build and manage your image generation prompts
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Template
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No templates</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Create your first prompt template to get started.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {template.steps.length} step{template.steps.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {template.description && (
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                )}

                {/* Steps Preview */}
                <div className="mb-3 space-y-2">
                  {template.steps.slice(0, 2).map((step, index) => (
                    <div key={index} className="rounded bg-gray-50 p-2 dark:bg-gray-900">
                      <p className="truncate text-xs text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Step {index + 1}:</span> {step.prompt}
                      </p>
                      <div className="mt-1 flex gap-2 text-xs text-gray-500">
                        <span>{step.aspectRatio}</span>
                        <span>|</span>
                        <span>{step.imageSize}</span>
                      </div>
                    </div>
                  ))}
                  {template.steps.length > 2 && (
                    <p className="text-center text-xs text-gray-500">
                      +{template.steps.length - 2} more step{template.steps.length - 2 !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{template._count?.runs || 0} runs</span>
                  <span>Updated {new Date(template.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => openEditModal(template)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => duplicateTemplate(template)}
                  className="flex-1 border-l border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="flex-1 border-l border-gray-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-gray-700 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-800">
            <form onSubmit={handleSubmit}>
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingTemplate ? 'Edit Template' : 'Create Template'}
                </h2>
              </div>

              <div className="space-y-6 p-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Kitchen Renovation Visualization"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Describe what this template does..."
                  />
                </div>

                {/* Steps */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Prompt Steps
                  </label>
                  <div className="pl-10">
                    <ChainBuilder steps={steps} onChange={setSteps} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !name || steps.length === 0}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingTemplate ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PromptsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    }>
      <PromptsContent />
    </Suspense>
  );
}
