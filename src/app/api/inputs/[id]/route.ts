import { NextRequest, NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';

// GET single input set
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = await getDbClient();
    const { id } = await params;

    const inputSet = await prisma.inputSet.findUnique({
      where: { id },
      include: {
        images: true,
        products: true,
        runs: {
          include: {
            template: { select: { name: true } },
            results: { select: { id: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!inputSet) {
      return NextResponse.json(
        { error: 'Input set not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(inputSet);
  } catch (error) {
    console.error('[API] Error fetching input set:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to fetch input set' },
      { status: 500 }
    );
  }
}

// PUT update input set
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = await getDbClient();
    const { id } = await params;
    const body = await request.json();
    const { name, images, products, removeImageIds, removeProductIds } = body;

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Remove images if specified
      if (removeImageIds?.length > 0) {
        await tx.image.deleteMany({
          where: { id: { in: removeImageIds } },
        });
      }

      // Remove products if specified
      if (removeProductIds?.length > 0) {
        await tx.product.deleteMany({
          where: { id: { in: removeProductIds } },
        });
      }

      // Update the input set
      const inputSet = await tx.inputSet.update({
        where: { id },
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

      return inputSet;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Error updating input set:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to update input set' },
      { status: 500 }
    );
  }
}

// DELETE input set
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = await getDbClient();
    const { id } = await params;

    await prisma.inputSet.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error deleting input set:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to delete input set' },
      { status: 500 }
    );
  }
}
