import { useState, useEffect, useCallback, useRef } from 'react';
import type { CatalogProduct, SelectedProduct, ExistingProduct, UseProductSearchReturn, Category } from './types';

export function useProductSearch(
  selectedProducts: SelectedProduct[],
  onProductsChange: (products: SelectedProduct[]) => void,
  existingProducts: ExistingProduct[] = []
): UseProductSearchReturn {
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<Category[]>([{ id: '', name: 'All Products' }]);

  // Refs for abort controller and debounce timer
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/catalog/categories');
        const data = await response.json();
        if (data.categories && Array.isArray(data.categories)) {
          setCategories([
            { id: '', name: 'All Products' },
            ...data.categories,
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      params.set('page', page.toString());
      params.set('perPage', '12');

      const response = await fetch(`/api/catalog?${params}`, {
        signal: abortControllerRef.current.signal
      });
      const data = await response.json();

      setProducts(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Silently ignore aborted requests
      }
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, search, page]);

  useEffect(() => {
    if (showSearch) {
      fetchProducts();
    }
  }, [showSearch, fetchProducts]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setPage(1);
    }, 300);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const addProduct = (product: CatalogProduct) => {
    const isSelected = selectedProducts.some((p) => p.catalogId === product.id);
    const isExisting = existingProducts.some((p) => p.catalogId === product.id);

    if (isSelected || isExisting) return;

    const newProduct: SelectedProduct = {
      catalogId: product.id,
      name: product.name,
      category: product.category.name,
      imageUrl: product.featuredImage?.url,
      metadata: product as unknown as Record<string, unknown>,
    };

    onProductsChange([...selectedProducts, newProduct]);
  };

  const removeProduct = (catalogId: string) => {
    onProductsChange(selectedProducts.filter((p) => p.catalogId !== catalogId));
  };

  const isProductSelected = (productId: string) => {
    return (
      selectedProducts.some((p) => p.catalogId === productId) ||
      existingProducts.some((p) => p.catalogId === productId)
    );
  };

  return {
    showSearch,
    setShowSearch,
    products,
    loading,
    search,
    category,
    categories,
    page,
    totalPages,
    handleSearchChange,
    handleCategoryChange,
    setPage,
    addProduct,
    removeProduct,
    isProductSelected,
  };
}
