'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/ImageUploader';
import ProductSearch from '@/components/ProductSearch';

interface Image {
  id: string;
  filename: string;
  path: string;
  mimeType: string;
}

interface Product {
  id: string;
  catalogId: string;
  name: string;
  category: string;
  imageUrl: string | null;
  metadata: string;
}

interface InputSet {
  id: string;
  name: string;
  images: Image[];
  products: Product[];
  createdAt: string;
  updatedAt: string;
  _count?: { runs: number };
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

interface SelectedProduct {
  catalogId: string;
  name: string;
  category: string;
  imageUrl?: string;
  metadata: Record<string, unknown>;
}

function InputSetsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [inputSets, setInputSets] = useState<InputSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(searchParams.get('new') === 'true');
  const [editingSet, setEditingSet] = useState<InputSet | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [newImages, setNewImages] = useState<ImageFile[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [removeImageIds, setRemoveImageIds] = useState<string[]>([]);
  const [removeProductIds, setRemoveProductIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInputSets();
  }, []);

  const fetchInputSets = async () => {
    try {
      const response = await fetch('/api/inputs');
      const data = await response.json();
      setInputSets(data);
    } catch (error) {
      console.error('Failed to fetch input sets:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setNewImages([]);
    setSelectedProducts([]);
    setRemoveImageIds([]);
    setRemoveProductIds([]);
    setEditingSet(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
    router.replace('/inputs', { scroll: false });
  };

  const openEditModal = (inputSet: InputSet) => {
    setEditingSet(inputSet);
    setName(inputSet.name);
    setNewImages([]);
    setSelectedProducts([]);
    setRemoveImageIds([]);
    setRemoveProductIds([]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
    router.replace('/inputs', { scroll: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Upload new images first
      let uploadedImages: Array<{ filename: string; path: string; mimeType: string }> = [];
      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((img) => formData.append('files', img.file));

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload images');
        }

        const uploadData = await uploadResponse.json();
        uploadedImages = uploadData.files;
      }

      const payload = {
        name,
        images: uploadedImages,
        products: selectedProducts,
        ...(editingSet && {
          removeImageIds,
          removeProductIds,
        }),
      };

      const url = editingSet ? `/api/inputs/${editingSet.id}` : '/api/inputs';
      const method = editingSet ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save input set');
      }

      await fetchInputSets();
      closeModal();
      toast.success(editingSet ? 'Input set updated' : 'Input set created');
    } catch {
      toast.error('Failed to save input set');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this input set?')) return;

    try {
      const response = await fetch(`/api/inputs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete input set');
      }

      await fetchInputSets();
      toast.success('Input set deleted');
    } catch {
      toast.error('Failed to delete input set');
    }
  };

  const handleRemoveExistingImage = (imageId: string) => {
    setRemoveImageIds((prev) => [...prev, imageId]);
  };

  const handleRemoveExistingProduct = (productId: string) => {
    setRemoveProductIds((prev) => [...prev, productId]);
  };

  const existingImages = editingSet?.images.filter((img) => !removeImageIds.includes(img.id)) || [];
  const existingProducts = editingSet?.products.filter((prod) => !removeProductIds.includes(prod.id)) || [];

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Input Sets</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage your image and product collections for generation
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Input Set
        </button>
      </div>

      {inputSets.length === 0 ? (
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
              d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No input sets</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Get started by creating a new input set with images and products.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Input Set
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {inputSets.map((inputSet) => (
            <div
              key={inputSet.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Image Preview */}
              <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
                {inputSet.images.length > 0 ? (
                  <div className="flex h-full">
                    {inputSet.images.slice(0, 3).map((img, i) => (
                      <div
                        key={img.id}
                        className="relative flex-1"
                        style={{ zIndex: 3 - i }}
                      >
                        <img
                          src={img.path}
                          alt={img.filename}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                    {inputSet.images.length > 3 && (
                      <div className="absolute bottom-2 right-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
                        +{inputSet.images.length - 3} more
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{inputSet.name}</h3>
                <div className="mt-2 flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{inputSet.images.length} images</span>
                  <span>{inputSet.products.length} products</span>
                  <span>{inputSet._count?.runs || 0} runs</span>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Created {new Date(inputSet.createdAt).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openEditModal(inputSet)}
                    className="flex-1 rounded bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(inputSet.id)}
                    className="rounded bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-800">
            <form onSubmit={handleSubmit}>
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingSet ? 'Edit Input Set' : 'Create Input Set'}
                </h2>
              </div>

              <div className="space-y-6 p-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Kitchen Remodel Project"
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Images
                  </label>
                  <ImageUploader
                    onImagesChange={setNewImages}
                    existingImages={existingImages}
                    onRemoveExisting={handleRemoveExistingImage}
                  />
                </div>

                {/* Products */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Products
                  </label>
                  <ProductSearch
                    selectedProducts={selectedProducts}
                    onProductsChange={setSelectedProducts}
                    existingProducts={existingProducts}
                    onRemoveExisting={handleRemoveExistingProduct}
                  />
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
                  disabled={saving || !name}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingSet ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InputSetsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    }>
      <InputSetsContent />
    </Suspense>
  );
}
