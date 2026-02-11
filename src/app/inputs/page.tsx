"use client";

import { Suspense } from "react";
import ImageUploader from "@/components/ImageUploader";
import ProductSearch from "@/components/ProductSearch";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useInputSetsPage } from "./useInputSetsPage";
import { FolderClosed, Image, Pencil, Plus, Trash2 } from "lucide-react";

function InputSetsContent() {
  const {
    inputSets,
    loading,
    showModal,
    editingSet,
    name,
    saving,
    existingImages,
    existingProducts,
    setName,
    setNewImages,
    setSelectedProducts,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
    handleRemoveExistingImage,
    handleRemoveExistingProduct,
  } = useInputSetsPage();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="md:p-8 p-4 h-full overflow-auto">
      <div className="mb-6 flex lg:items-center items-start justify-between flex-col lg:flex-row gap-4">
        <div>
          <h1 className="lg:text-3xl text-2xl font-bold text-zinc-900 dark:text-[#eceff4]">
            Input Sets
          </h1>
          <p className="mt-1 lg:text-base text-sm text-zinc-600 dark:text-[#d8dee9]">
            Manage your image and product collections for generation
          </p>
        </div>
        <Button onClick={openCreateModal} icon={<Plus className="size-5" />}>
          New Input Set
        </Button>
      </div>

      {inputSets.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-zinc-300 p-12 text-center dark:border-[#4c566a]">
          <FolderClosed className="size-12 text-zinc-400 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-zinc-900 dark:text-[#eceff4]">
            No input sets
          </h3>
          <p className="mt-1 text-zinc-500 dark:text-[#d8dee9]">
            Get started by creating a new input set with images and products.
          </p>
          <Button onClick={openCreateModal} className="mt-4">
            Create Input Set
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {inputSets.map((inputSet) => (
            <div
              key={inputSet.id}
              className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-lg hover:shadow-violet-500/10 dark:border-[#4c566a] dark:bg-[#3b4252]"
            >
              {/* Image Preview */}
              <div className="relative h-40 bg-zinc-100 dark:bg-[#434c5e]">
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
                    <Image className="size-10 text-zinc-400 mx-auto" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-zinc-900 dark:text-[#eceff4]">
                  {inputSet.name}
                </h3>
                <div className="mt-2 flex gap-4 text-sm text-zinc-500 dark:text-[#d8dee9]">
                  <span>{inputSet.images.length} images</span>
                  <span>{inputSet.products.length} products</span>
                  <span>{inputSet._count?.runs || 0} runs</span>
                </div>
                <p className="mt-2 text-xs text-zinc-400">
                  Created {new Date(inputSet.createdAt).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(inputSet)}
                    icon={<Pencil className="h-4 w-4" />}
                    className="flex-1 bg-zinc-100 dark:bg-[#434c5e]"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(inputSet.id)}
                    icon={<Trash2 className="h-4 w-4" />}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingSet ? "Edit Input Set" : "Create Input Set"}
        className="!max-w-3xl"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="input-set-form"
              disabled={saving || !name}
              loading={saving}
            >
              {editingSet ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <form id="input-set-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <Input
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Kitchen Remodel Project"
          />

          {/* Images */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
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
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
              Products
            </label>
            <ProductSearch
              selectedProducts={[]}
              onProductsChange={setSelectedProducts}
              existingProducts={existingProducts}
              onRemoveExisting={handleRemoveExistingProduct}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function InputSetsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
        </div>
      }
    >
      <InputSetsContent />
    </Suspense>
  );
}
