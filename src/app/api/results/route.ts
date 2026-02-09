import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET all results with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const minRating = searchParams.get('minRating');
    const maxRating = searchParams.get('maxRating');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);
    const runId = searchParams.get('runId');

    const where: Record<string, unknown> = {};

    if (runId) {
      where.runId = runId;
    }

    if (minRating || maxRating) {
      where.rating = {};
      if (minRating) {
        (where.rating as Record<string, number>).gte = parseInt(minRating);
      }
      if (maxRating) {
        (where.rating as Record<string, number>).lte = parseInt(maxRating);
      }
    }

    let results = await prisma.runResult.findMany({
      where,
      include: {
        run: {
          include: {
            inputSet: { select: { id: true, name: true } },
            template: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter by tags in application layer (SQLite doesn't support JSON queries well)
    if (tags && tags.length > 0) {
      results = results.filter((result) => {
        try {
          const resultTags = JSON.parse(result.tags) as string[];
          return tags.some((tag) => resultTags.includes(tag));
        } catch {
          return false;
        }
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('[API] Error fetching results:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
