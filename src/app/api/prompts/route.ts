import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { DEFAULT_MODEL, DEFAULT_ASPECT_RATIO, DEFAULT_IMAGE_SIZE, DEFAULT_TEMPERATURE } from '@/lib/constants';

// GET all prompt templates
export async function GET() {
  try {
    const templates = await prisma.promptTemplate.findMany({
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { runs: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('[API] Error fetching prompt templates:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to fetch prompt templates' },
      { status: 500 }
    );
  }
}

// POST create new prompt template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, steps } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!steps || steps.length === 0) {
      return NextResponse.json(
        { error: 'At least one step is required' },
        { status: 400 }
      );
    }

    const template = await prisma.promptTemplate.create({
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

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('[API] Error creating prompt template:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to create prompt template' },
      { status: 500 }
    );
  }
}
