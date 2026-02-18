import { NextResponse } from 'next/server';

const CATALOG_API_URL = process.env.CATALOG_API_URL || 'https://api.studioxlowes.com/catalog/v3';

interface CatalogProduct {
  category: {
    id: string;
    name: string;
  };
}

interface CatalogApiResponse {
  data: CatalogProduct[];
  pagination: {
    lastPage: number;
  };
}

async function fetchPage(page: number, perPage: number): Promise<CatalogApiResponse> {
  const response = await fetch(
    `${CATALOG_API_URL}/products?perPage=${perPage}&currentPage=${page}`,
    {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error(`Catalog API error: ${response.status}`);
  }

  return response.json() as Promise<CatalogApiResponse>;
}

export async function GET() {
  try {
    const perPage = 100;

    // Fetch first page to get pagination info
    const firstPage = await fetchPage(1, perPage);
    const lastPage = firstPage.pagination.lastPage;

    // Collect categories from first page
    const categoryNames = new Set<string>();
    for (const product of firstPage.data || []) {
      if (product.category?.name) {
        categoryNames.add(product.category.name);
      }
    }

    // Fetch remaining pages in parallel
    if (lastPage > 1) {
      const pageNumbers = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
      const remainingPages = await Promise.all(
        pageNumbers.map(page => fetchPage(page, perPage))
      );

      for (const pageResponse of remainingPages) {
        for (const product of pageResponse.data || []) {
          if (product.category?.name) {
            categoryNames.add(product.category.name);
          }
        }
      }
    }

    // Convert to array and sort alphabetically
    // Use name as the id since that's what the catalog API expects for filtering
    const categories = Array.from(categoryNames)
      .sort((a, b) => a.localeCompare(b))
      .map(name => ({ id: name, name }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('[API] Categories error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', categories: [] },
      { status: 500 }
    );
  }
}
