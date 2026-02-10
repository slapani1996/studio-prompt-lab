import { NextRequest, NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';
import { DEFAULT_MODEL, DEFAULT_ASPECT_RATIO, DEFAULT_IMAGE_SIZE, DEFAULT_TEMPERATURE } from '@/lib/constants';

// GET single prompt template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = await getDbClient();
    const { id } = await params;

    const template = await prisma.promptTemplate.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
        runs: {
          include: {
            inputSet: { select: { name: true } },
            results: { select: { id: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Prompt template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('[API] Error fetching prompt template:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to fetch prompt template' },
      { status: 500 }
    );
  }
}

// PUT update prompt template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = await getDbClient();
    const { id } = await params;
    const body = await request.json();
    const { name, description, steps } = body;

    // Delete existing steps and recreate
    const template = await prisma.$transaction(async (tx) => {
      // Delete existing steps
      await tx.promptStep.deleteMany({
        where: { templateId: id },
      });

      // Update template with new steps
      return tx.promptTemplate.update({
        where: { id },
        data: {
          name,
          description,
          steps: {
            create: steps.map((step: {
              order: number;
              prompt: string;
              model?: string;
              aspectRatio?: string;
              imageSize?: string;
              temperature?: number;
            }, index: number) => ({
              order: step.order ?? index,
              prompt: step.prompt,
              model: step.model || DEFAULT_MODEL,
              aspectRatio: step.aspectRatio || DEFAULT_ASPECT_RATIO,
              imageSize: step.imageSize || DEFAULT_IMAGE_SIZE,
              temperature: step.temperature ?? DEFAULT_TEMPERATURE,
            })),
          },
        },
        include: {
          steps: {
            orderBy: { order: 'asc' },
          },
        },
      });
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('[API] Error updating prompt template:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to update prompt template' },
      { status: 500 }
    );
  }
}

// DELETE prompt template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = await getDbClient();
    const { id } = await params;

    await prisma.promptTemplate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error deleting prompt template:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to delete prompt template' },
      { status: 500 }
    );
  }
}
