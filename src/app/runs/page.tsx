'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getStatusColor } from '@/lib/utils';

interface InputSet {
  id: string;
  name: string;
}

interface Template {
  id: string;
  name: string;
}

interface RunResult {
  id: string;
  stepOrder: number;
  outputImage: string;
  rating: number | null;
}

interface Run {
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

function RunsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [runs, setRuns] = useState<Run[]>([]);
  const [inputSets, setInputSets] = useState<InputSet[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(searchParams.get('new') === 'true');

  // Form state
  const [selectedInputSet, setSelectedInputSet] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [executing, setExecuting] = useState(false);

  // Filter state
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);

      const [runsRes, inputSetsRes, templatesRes] = await Promise.all([
        fetch(`/api/runs?${params}`),
        fetch('/api/inputs'),
        fetch('/api/prompts'),
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
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
    router.replace('/runs', { scroll: false });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInputSet('');
    setSelectedTemplate('');
    router.replace('/runs', { scroll: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedInputSet || !selectedTemplate) {
      toast.error('Please select an input set and template');
      return;
    }

    setExecuting(true);

    try {
      // Create the run
      const createRes = await fetch('/api/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputSetId: selectedInputSet,
          templateId: selectedTemplate,
        }),
      });

      if (!createRes.ok) {
        throw new Error('Failed to create run');
      }

      const run = await createRes.json();

      // Execute the run
      const executeRes = await fetch(`/api/runs/${run.id}/execute`, {
        method: 'POST',
      });

      if (!executeRes.ok) {
        throw new Error('Failed to execute run');
      }

      await fetchData();
      closeModal();
      toast.success('Run started successfully');

      // Navigate to run detail
      router.push(`/runs/${run.id}`);
    } catch {
      toast.error('Failed to start run');
    } finally {
      setExecuting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this run?')) return;

    try {
      const response = await fetch(`/api/runs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete run');
      }

      await fetchData();
      toast.success('Run deleted');
    } catch {
      toast.error('Failed to delete run');
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-[#eceff4]">Run History</h1>
          <p className="mt-1 text-zinc-600 dark:text-[#d8dee9]">
            View and manage your image generation runs
          </p>
        </div>
        <button
          onClick={openModal}
          disabled={inputSets.length === 0 || templates.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
          New Run
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-[#4c566a] dark:bg-[#434c5e] dark:text-[#eceff4]"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {runs.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-zinc-300 p-12 text-center dark:border-[#4c566a]">
          <svg
            className="mx-auto h-12 w-12 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-zinc-900 dark:text-[#eceff4]">No runs yet</h3>
          <p className="mt-1 text-zinc-500 dark:text-[#d8dee9]">
            {inputSets.length === 0 || templates.length === 0
              ? 'Create an input set and template first.'
              : 'Start a new run to generate images.'}
          </p>
          {inputSets.length > 0 && templates.length > 0 && (
            <button
              onClick={openModal}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
            >
              Start New Run
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-[#4c566a]">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-[#4c566a]">
            <thead className="bg-zinc-50 dark:bg-[#3b4252]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-[#d8dee9]">
                  Run
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-[#d8dee9]">
                  Input Set
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-[#d8dee9]">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-[#d8dee9]">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-[#d8dee9]">
                  Results
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-[#d8dee9]">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-[#d8dee9]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white dark:divide-[#4c566a] dark:bg-[#3b4252]">
              {runs.map((run) => (
                <tr key={run.id} className="hover:bg-zinc-50 dark:hover:bg-[#434c5e]">
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link
                      href={`/runs/${run.id}`}
                      className="font-medium text-violet-600 hover:text-violet-700 dark:text-[#88c0d0]"
                    >
                      {run.id.slice(0, 8)}...
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-700 dark:text-[#e5e9f0]">
                    {run.inputSet.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-700 dark:text-[#e5e9f0]">
                    {run.template.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(run.status)}`}>
                      {run.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-700 dark:text-[#e5e9f0]">
                    {run.results.length} image{run.results.length !== 1 ? 's' : ''}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-[#d8dee9]">
                    {new Date(run.createdAt).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(run.id)}
                      className="text-rose-600 hover:text-rose-700 dark:text-rose-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Run Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-[#3b4252]">
            <form onSubmit={handleSubmit}>
              <div className="border-b border-zinc-200 px-6 py-4 dark:border-[#4c566a]">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-[#eceff4]">Start New Run</h2>
              </div>

              <div className="space-y-4 p-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
                    Input Set
                  </label>
                  <select
                    value={selectedInputSet}
                    onChange={(e) => setSelectedInputSet(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-[#4c566a] dark:bg-[#434c5e] dark:text-[#eceff4]"
                  >
                    <option value="">Select an input set...</option>
                    {inputSets.map((set) => (
                      <option key={set.id} value={set.id}>
                        {set.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
                    Prompt Template
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-[#4c566a] dark:bg-[#434c5e] dark:text-[#eceff4]"
                  >
                    <option value="">Select a template...</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-zinc-200 px-6 py-4 dark:border-[#4c566a]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-[#4c566a] dark:text-[#e5e9f0] dark:hover:bg-[#434c5e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={executing || !selectedInputSet || !selectedTemplate}
                  className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  {executing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Running...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                      </svg>
                      Start Run
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RunsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    }>
      <RunsContent />
    </Suspense>
  );
}
