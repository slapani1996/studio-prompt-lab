import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type {
  Image,
  Product,
  InputSet,
  ImageFile,
  SelectedProduct,
  UseInputSetsPageReturn,
} from "./types";

export type { UseInputSetsPageReturn } from "./types";

export function useInputSetsPage(): UseInputSetsPageReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allInputSets, setAllInputSets] = useState<InputSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(
    searchParams.get("new") === "true"
  );
  const [editingSet, setEditingSet] = useState<InputSet | null>(null);

  const [name, setName] = useState("");
  const [newImages, setNewImages] = useState<ImageFile[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [removeImageIds, setRemoveImageIds] = useState<string[]>([]);
  const [removeProductIds, setRemoveProductIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchInputSets = useCallback(async () => {
    try {
      const response = await fetch("/api/inputs");
      const data = await response.json();
      setAllInputSets(data);
    } catch (error) {
      console.error("Failed to fetch input sets:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const inputSets = useMemo(() => {
    if (!searchQuery.trim()) return allInputSets;
    const query = searchQuery.toLowerCase();
    return allInputSets.filter((inputSet) =>
      inputSet.name.toLowerCase().includes(query)
    );
  }, [allInputSets, searchQuery]);

  useEffect(() => {
    fetchInputSets();
  }, [fetchInputSets]);

  const resetForm = useCallback(() => {
    setName("");
    setNewImages([]);
    setSelectedProducts([]);
    setRemoveImageIds([]);
    setRemoveProductIds([]);
    setEditingSet(null);
  }, []);

  const openCreateModal = useCallback(() => {
    resetForm();
    setShowModal(true);
    router.replace("/inputs", { scroll: false });
  }, [resetForm, router]);

  const openEditModal = useCallback((inputSet: InputSet) => {
    setEditingSet(inputSet);
    setName(inputSet.name);
    setNewImages([]);
    setSelectedProducts([]);
    setRemoveImageIds([]);
    setRemoveProductIds([]);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    resetForm();
    router.replace("/inputs", { scroll: false });
  }, [resetForm, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);

      try {
        let uploadedImages: Array<{
          filename: string;
          path: string;
          mimeType: string;
        }> = [];
        if (newImages.length > 0) {
          const formData = new FormData();
          newImages.forEach((img) => formData.append("files", img.file));

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload images");
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

        const url = editingSet ? `/api/inputs/${editingSet.id}` : "/api/inputs";
        const method = editingSet ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to save input set");
        }

        await fetchInputSets();
        closeModal();
        toast.success(editingSet ? "Input set updated" : "Input set created");
      } catch {
        toast.error("Failed to save input set");
      } finally {
        setSaving(false);
      }
    },
    [
      name,
      newImages,
      selectedProducts,
      editingSet,
      removeImageIds,
      removeProductIds,
      fetchInputSets,
      closeModal,
    ]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this input set?")) return;

      try {
        const response = await fetch(`/api/inputs/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete input set");
        }

        await fetchInputSets();
        toast.success("Input set deleted");
      } catch {
        toast.error("Failed to delete input set");
      }
    },
    [fetchInputSets]
  );

  const handleRemoveExistingImage = useCallback((imageId: string) => {
    setRemoveImageIds((prev) => [...prev, imageId]);
  }, []);

  const handleRemoveExistingProduct = useCallback((productId: string) => {
    setRemoveProductIds((prev) => [...prev, productId]);
  }, []);

  const existingImages =
    editingSet?.images.filter((img) => !removeImageIds.includes(img.id)) || [];
  const existingProducts =
    editingSet?.products.filter(
      (prod) => !removeProductIds.includes(prod.id)
    ) || [];

  return {
    inputSets,
    loading,
    showModal,
    editingSet,
    name,
    newImages,
    selectedProducts,
    saving,
    existingImages,
    existingProducts,
    searchQuery,
    setName,
    setNewImages,
    setSelectedProducts,
    setSearchQuery,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
    handleRemoveExistingImage,
    handleRemoveExistingProduct,
  };
}
