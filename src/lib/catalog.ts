const CATALOG_API_URL = process.env.CATALOG_API_URL || 'https://api.studioxlowes.com/catalog/v3';

export interface CatalogProduct {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  price?: number;
  availability?: string;
  featuredImage?: {
    id: string;
    url: string;
  };
  [key: string]: unknown;
}

export interface CatalogApiResponse {
  data: CatalogProduct[];
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    to: number;
    from: number;
  };
}

export interface CatalogResponse {
  data: CatalogProduct[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export async function fetchProducts(options: {
  category?: string;
  search?: string;
  page?: number;
  perPage?: number;
}): Promise<CatalogResponse> {
  const { category, search, page = 1, perPage = 25 } = options;

  // Build URL with query parameters
  const params = new URLSearchParams();

  // Map category ID to category name for the external API
  if (category) {
    const categoryObj = PRODUCT_CATEGORIES.find(c => c.id === category);
    if (categoryObj) {
      params.set('categoryName', categoryObj.name);
    }
  }

  params.set('perPage', perPage.toString());
  params.set('currentPage', page.toString());

  const url = `${CATALOG_API_URL}/products?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Catalog API error: ${response.status}`);
  }

  const apiResponse = await response.json() as CatalogApiResponse;

  // Handle the API response format
  let products = apiResponse.data || [];
  const apiPagination = apiResponse.pagination;

  // Apply search filter after fetching (API doesn't support text search)
  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      (p.category?.name || '').toLowerCase().includes(searchLower)
    );
  }

  // If search was applied, recalculate pagination based on filtered results
  if (search) {
    return {
      data: products,
      pagination: {
        total: products.length,
        page: 1,
        perPage: products.length,
        totalPages: 1,
      },
    };
  }

  // Use API pagination when no search filter
  return {
    data: products,
    pagination: {
      total: apiPagination.total,
      page: apiPagination.currentPage,
      perPage: apiPagination.perPage,
      totalPages: apiPagination.lastPage,
    },
  };
}

export async function fetchProductById(id: string): Promise<CatalogProduct | null> {
  const url = `${CATALOG_API_URL}/products/${id}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Catalog API error: ${response.status}`);
  }

  return response.json();
}

export const PRODUCT_CATEGORIES = [
  { id: 'faucets', name: 'Faucets' },
  { id: 'mirrors', name: 'Mirror' },
  { id: 'shower-systems', name: 'Shower Systems' },
  { id: 'decorative-lighting', name: 'Decorative Lighting' },
  { id: 'vanities', name: 'Vanities' },
  { id: 'tub-doors', name: 'Tub Doors' },
  { id: 'towel-rings', name: 'Towel Rings' },
  { id: 'tub-filler', name: 'Tub Filler' },
];
