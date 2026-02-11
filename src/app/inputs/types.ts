export interface Image {
  id: string;
  filename: string;
  path: string;
  mimeType: string;
}

export interface Product {
  id: string;
  catalogId: string;
  name: string;
  category: string;
  imageUrl: string | null;
  metadata: string;
}

export interface InputSet {
  id: string;
  name: string;
  images: Image[];
  products: Product[];
  createdAt: string;
  updatedAt: string;
  _count?: { runs: number };
}

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

export interface SelectedProduct {
  catalogId: string;
  name: string;
  category: string;
  imageUrl?: string;
  metadata: Record<string, unknown>;
}

export interface UseInputSetsPageReturn {
  inputSets: InputSet[];
  loading: boolean;
  showModal: boolean;
  editingSet: InputSet | null;
  name: string;
  newImages: ImageFile[];
  selectedProducts: SelectedProduct[];
  saving: boolean;
  existingImages: Image[];
  existingProducts: Product[];
  searchQuery: string;
  setName: (name: string) => void;
  setNewImages: (images: ImageFile[]) => void;
  setSelectedProducts: (products: SelectedProduct[]) => void;
  setSearchQuery: (query: string) => void;
  openCreateModal: () => void;
  openEditModal: (inputSet: InputSet) => void;
  closeModal: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleRemoveExistingImage: (imageId: string) => void;
  handleRemoveExistingProduct: (productId: string) => void;
}
