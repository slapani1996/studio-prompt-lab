import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET single result
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await prisma.runResult.findUnique({
      where: { id },
      include: {
        run: {
          include: {
            inputSet: { select: { name: true } },
            template: { select: { name: true } },
          },
        },
      },
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Error fetching result:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to fetch result' },
      { status: 500 }
    );
  }
}

// PATCH update result (rating, notes, tags)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { rating, notes, tags } = body;

    const updateData: Record<string, unknown> = {};

    if (rating !== undefined) {
      updateData.rating = rating;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (tags !== undefined) {
      updateData.tags = JSON.stringify(tags);
    }

    const result = await prisma.runResult.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Error updating result:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to update result' },
      { status: 500 }
    );
  }
}
