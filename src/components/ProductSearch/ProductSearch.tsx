"use client";

import { useProductSearch } from "./useProductSearch";
import type { ProductSearchProps, Category } from "./types";
import { Dropdown } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Check, Image, Plus, X } from "lucide-react";

const CATEGORIES: Category[] = [
  { id: "", name: "All Products" },
  { id: "faucets", name: "Faucets" },
  { id: "mirrors", name: "Mirrors" },
  { id: "shower-systems", name: "Shower Systems" },
  { id: "decorative-lighting", name: "Decorative Lighting" },
  { id: "vanities", name: "Vanities" },
  { id: "tub-doors", name: "Tub Doors" },
  { id: "towel-rings", name: "Towel Rings" },
  { id: "tub-filler", name: "Tub Filler" },
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

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <div className="space-y-4">
      {/* Existing Products */}
      {existingProducts.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
            Existing Products
          </h4>
          <div className="flex flex-wrap gap-2">
            {existingProducts.map((product) => (
              <div
                key={product.id}
                className="flex md:items-center items-start gap-2 md:rounded-full rounded-md bg-violet-100 py-1 pl-1 pr-3 dark:bg-violet-900/30"
              >
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                )}
                <span className="text-sm text-violet-800 dark:text-violet-300">
                  {product.name}
                </span>
                {onRemoveExisting && (
                  <button
                    type="button"
                    onClick={() => onRemoveExisting(product.id)}
                    className="ml-1 text-violet-600 hover:text-violet-800 dark:text-violet-400"
                  >
                    <X className="size-4" />
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
          <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]">
            New Products ({selectedProducts.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedProducts.map((product) => (
              <div
                key={product.catalogId}
                className="flex items-center gap-2 rounded-full bg-emerald-100 py-1 pl-1 pr-3 dark:bg-emerald-900/30"
              >
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                )}
                <span className="text-sm text-emerald-800 dark:text-emerald-300">
                  {product.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeProduct(product.catalogId)}
                  className="ml-1 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400"
                >
                  <X className="size-4" />
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
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-zinc-300 px-4 py-2 text-sm text-zinc-600 hover:border-zinc-400 hover:text-zinc-700 dark:border-[#4c566a] dark:text-[#d8dee9]"
        >
          <Plus className="size-5" />
          Search & Add Products
        </button>
      )}

      {/* Search Panel */}
      {showSearch && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-[#4c566a] dark:bg-[#3b4252]">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-medium text-zinc-900 dark:text-[#eceff4]">
              Product Catalog
            </h4>
            <button
              type="button"
              onClick={() => setShowSearch(false)}
              className="text-zinc-500 hover:text-zinc-700 dark:text-[#d8dee9]"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search products..."
              />
            </div>
            <Dropdown
              options={categoryOptions}
              value={category}
              onChange={handleCategoryChange}
              ariaLabel="Filter by category"
              className="w-full sm:w-auto sm:min-w-[180px]"
              buttonClassName="rounded-md focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              menuClassName="rounded-md"
            />
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-zinc-500">
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
                        ? "border-green-300 bg-emerald-50 dark:border-green-700 dark:bg-emerald-900/20"
                        : "border-zinc-200 hover:border-violet-300 hover:bg-violet-50 dark:border-[#4c566a] dark:hover:border-[#88c0d0] dark:hover:bg-[#5e81ac]/20"
                    }`}
                  >
                    {product.featuredImage?.url ? (
                      <img
                        src={product.featuredImage.url}
                        alt={product.name}
                        className="mb-2 h-20 w-full rounded object-cover"
                      />
                    ) : (
                      <div className="mb-2 flex h-20 items-center justify-center rounded bg-zinc-200 dark:bg-[#434c5e]">
                        <Image className="size-8 text-zinc-400" />
                      </div>
                    )}
                    <p className="truncate text-xs font-medium text-zinc-900 dark:text-[#eceff4]">
                      {product.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500">
                      {product.category.name}
                    </p>
                    {isProductSelected(product.id) && (
                      <span className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                        <Check className="size-4" />
                        Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-zinc-600 dark:text-[#d8dee9]">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
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
