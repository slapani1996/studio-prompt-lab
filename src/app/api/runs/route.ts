import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET all runs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const inputSetId = searchParams.get('inputSetId') || undefined;
    const templateId = searchParams.get('templateId') || undefined;

    const runs = await prisma.run.findMany({
      where: {
        ...(status && { status }),
        ...(inputSetId && { inputSetId }),
        ...(templateId && { templateId }),
      },
      include: {
        inputSet: {
          select: { id: true, name: true },
        },
        template: {
          select: { id: true, name: true },
        },
        results: {
          orderBy: { stepOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(runs);
  } catch (error) {
    console.error('[API] Error fetching runs:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to fetch runs' },
      { status: 500 }
    );
  }
}

// POST create and execute a new run
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inputSetId, templateId } = body;

    if (!inputSetId || !templateId) {
      return NextResponse.json(
        { error: 'inputSetId and templateId are required' },
        { status: 400 }
      );
    }

    // Verify input set and template exist
    const [inputSet, template] = await Promise.all([
      prisma.inputSet.findUnique({
        where: { id: inputSetId },
        include: { images: true, products: true },
      }),
      prisma.promptTemplate.findUnique({
        where: { id: templateId },
        include: { steps: { orderBy: { order: 'asc' } } },
      }),
    ]);

    if (!inputSet) {
      return NextResponse.json(
        { error: 'Input set not found' },
        { status: 404 }
      );
    }

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Create the run
    const run = await prisma.run.create({
      data: {
        inputSetId,
        templateId,
        status: 'pending',
      },
      include: {
        inputSet: {
          select: { id: true, name: true },
        },
        template: {
          include: { steps: { orderBy: { order: 'asc' } } },
        },
      },
    });

    return NextResponse.json(run, { status: 201 });
  } catch (error) {
    console.error('[API] Error creating run:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to create run' },
      { status: 500 }
    );
  }
}
