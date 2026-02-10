import { NextRequest, NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';

// GET single run
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = await getDbClient();
    const { id } = await params;

    const run = await prisma.run.findUnique({
      where: { id },
      include: {
        inputSet: {
          include: {
            images: true,
            products: true,
          },
        },
        template: {
          include: {
            steps: { orderBy: { order: 'asc' } },
          },
        },
        results: {
          orderBy: { stepOrder: 'asc' },
        },
      },
    });

    if (!run) {
      return NextResponse.json(
        { error: 'Run not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(run);
  } catch (error) {
    console.error('[API] Error fetching run:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to fetch run' },
      { status: 500 }
    );
  }
}

// DELETE run
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = await getDbClient();
    const { id } = await params;

    await prisma.run.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error deleting run:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to delete run' },
      { status: 500 }
    );
  }
}
