import { useState, useEffect, useCallback } from 'react';
import type { CatalogProduct, SelectedProduct, ExistingProduct, UseProductSearchReturn } from './types';

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
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      params.set('page', page.toString());
      params.set('perPage', '12');

      const response = await fetch(`/api/catalog?${params}`);
      const data = await response.json();

      setProducts(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
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
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        setPage(1);
        fetchProducts();
      }, 300)
    );
  };

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
