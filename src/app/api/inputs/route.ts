import { NextRequest, NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';

// GET all input sets
export async function GET() {
  try {
    const prisma = await getDbClient();
    const inputSets = await prisma.inputSet.findMany({
      include: {
        images: true,
        products: true,
        _count: {
          select: { runs: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(inputSets);
  } catch (error) {
    console.error('[API] Error fetching input sets:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to fetch input sets' },
      { status: 500 }
    );
  }
}

// POST create new input set
export async function POST(request: NextRequest) {
  try {
    const prisma = await getDbClient();
    const body = await request.json();
    const { name, images, products } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const inputSet = await prisma.inputSet.create({
      data: {
        name,
        images: {
          create: images?.map((img: { filename: string; path: string; mimeType: string }) => ({
            filename: img.filename,
            path: img.path,
            mimeType: img.mimeType,
          })) || [],
        },
        products: {
          create: products?.map((prod: { catalogId: string; name: string; category: string; imageUrl?: string; metadata: unknown }) => ({
            catalogId: prod.catalogId,
            name: prod.name,
            category: prod.category,
            imageUrl: prod.imageUrl,
            metadata: JSON.stringify(prod.metadata),
          })) || [],
        },
      },
      include: {
        images: true,
        products: true,
      },
    });

    return NextResponse.json(inputSet, { status: 201 });
  } catch (error) {
    console.error('[API] Error creating input set:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to create input set' },
      { status: 500 }
    );
  }
}
