export interface CatalogProduct {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  price?: number;
  featuredImage?: {
    url: string;
  };
}

export interface SelectedProduct {
  catalogId: string;
  name: string;
  category: string;
  imageUrl?: string;
  metadata: Record<string, unknown>;
}

export interface ExistingProduct {
  id: string;
  catalogId: string;
  name: string;
  category: string;
  imageUrl: string | null;
}

export interface ProductSearchProps {
  selectedProducts: SelectedProduct[];
  onProductsChange: (products: SelectedProduct[]) => void;
  existingProducts?: ExistingProduct[];
  onRemoveExisting?: (id: string) => void;
}

export interface UseProductSearchReturn {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  products: CatalogProduct[];
  loading: boolean;
  search: string;
  category: string;
  categories: Category[];
  page: number;
  totalPages: number;
  handleSearchChange: (value: string) => void;
  handleCategoryChange: (value: string) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  addProduct: (product: CatalogProduct) => void;
  removeProduct: (catalogId: string) => void;
  isProductSelected: (productId: string) => boolean;
}

export interface Category {
  id: string;
  name: string;
}
