import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts, PRODUCT_CATEGORIES } from '@/lib/catalog';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '25');

    const result = await fetchProducts({ category, search, page, perPage });

    return NextResponse.json({
      ...result,
      categories: PRODUCT_CATEGORIES,
    });
  } catch (error) {
    console.error('[API] Catalog error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
