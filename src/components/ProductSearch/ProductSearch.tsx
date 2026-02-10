'use client';

import { useProductSearch } from './useProductSearch';
import type { ProductSearchProps, Category } from './types';

const CATEGORIES: Category[] = [
  { id: '', name: 'All Products' },
  { id: 'faucets', name: 'Faucets' },
  { id: 'mirrors', name: 'Mirrors' },
  { id: 'shower-systems', name: 'Shower Systems' },
  { id: 'decorative-lighting', name: 'Decorative Lighting' },
  { id: 'vanities', name: 'Vanities' },
  { id: 'tub-doors', name: 'Tub Doors' },
  { id: 'towel-rings', name: 'Towel Rings' },
  { id: 'tub-filler', name: 'Tub Filler' },
];

export function ProductSearch({
  selectedProducts,
  onProductsChange,
  existingProducts = [],
  onRemoveExisting,
}: ProductSearchProps) {
  const {
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
  } = useProductSearch(selectedProducts, onProductsChange, existingProducts);

  return (
    <div className="space-y-4">
      {/* Existing Products */}
      {existingProducts.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Existing Products
          </h4>
          <div className="flex flex-wrap gap-2">
            {existingProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-2 rounded-full bg-blue-100 py-1 pl-1 pr-3 dark:bg-blue-900/30"
              >
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                )}
                <span className="text-sm text-blue-800 dark:text-blue-300">{product.name}</span>
                {onRemoveExisting && (
                  <button
                    type="button"
                    onClick={() => onRemoveExisting(product.id)}
                    className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            New Products ({selectedProducts.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedProducts.map((product) => (
              <div
                key={product.catalogId}
                className="flex items-center gap-2 rounded-full bg-green-100 py-1 pl-1 pr-3 dark:bg-green-900/30"
              >
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                )}
                <span className="text-sm text-green-800 dark:text-green-300">{product.name}</span>
                <button
                  type="button"
                  onClick={() => removeProduct(product.catalogId)}
                  className="ml-1 text-green-600 hover:text-green-800 dark:text-green-400"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Products Button */}
      {!showSearch && (
        <button
          type="button"
          onClick={() => setShowSearch(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 dark:border-gray-600 dark:text-gray-400"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Search & Add Products
        </button>
      )}

      {/* Search Panel */}
      {showSearch && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-medium text-gray-900 dark:text-white">Product Catalog</h4>
            <button
              type="button"
              onClick={() => setShowSearch(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-auto dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-gray-500">
              No products found
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addProduct(product)}
                    disabled={isProductSelected(product.id)}
                    className={`rounded-lg border p-2 text-left transition-colors ${
                      isProductSelected(product.id)
                        ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-600 dark:hover:bg-blue-900/20'
                    }`}
                  >
                    {product.featuredImage?.url ? (
                      <img
                        src={product.featuredImage.url}
                        alt={product.name}
                        className="mb-2 h-20 w-full rounded object-cover"
                      />
                    ) : (
                      <div className="mb-2 flex h-20 items-center justify-center rounded bg-gray-200 dark:bg-gray-700">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                    )}
                    <p className="truncate text-xs font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">{product.category.name}</p>
                    {isProductSelected(product.id) && (
                      <span className="mt-1 inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductSearch;
