import { NextRequest, NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';

// Helper to get base URL from env or request headers
function getBaseUrl(request: NextRequest): string {
  // First try the env variable
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }

  // Fall back to request headers
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  return `${protocol}://${host}`;
}

// Helper to make output image path a full URL
function toFullUrl(baseUrl: string, path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}

// GET export runs/results as JSON
export async function GET(request: NextRequest) {
  try {
    const prisma = await getDbClient();
    const searchParams = request.nextUrl.searchParams;
    const runId = searchParams.get('runId');
    const format = searchParams.get('format') || 'json';
    const baseUrl = getBaseUrl(request);

    if (runId) {
      // Export single run
      const run = await prisma.run.findUnique({
        where: { id: runId },
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

      const exportData = {
        exportedAt: new Date().toISOString(),
        run: {
          id: run.id,
          status: run.status,
          createdAt: run.createdAt,
          inputSet: {
            name: run.inputSet.name,
            imageCount: run.inputSet.images.length,
            productCount: run.inputSet.products.length,
            products: run.inputSet.products.map((p) => ({
              name: p.name,
              category: p.category,
              catalogId: p.catalogId,
            })),
          },
          template: {
            name: run.template.name,
            steps: run.template.steps.map((s) => ({
              order: s.order,
              prompt: s.prompt,
              model: s.model,
              aspectRatio: s.aspectRatio,
              imageSize: s.imageSize,
            })),
          },
          results: run.results.map((r) => ({
            stepOrder: r.stepOrder,
            outputImage: toFullUrl(baseUrl, r.outputImage),
            rating: r.rating,
            notes: r.notes,
            tags: JSON.parse(r.tags || '[]'),
            metadata: JSON.parse(r.metadata || '{}'),
            createdAt: r.createdAt,
          })),
        },
      };

      if (format === 'csv') {
        // Convert to CSV for results
        const csvRows = [
          ['Step', 'Output Image', 'Rating', 'Tags', 'Notes', 'Created At'].join(','),
          ...run.results.map((r) =>
            [
              r.stepOrder,
              toFullUrl(baseUrl, r.outputImage),
              r.rating || '',
              JSON.parse(r.tags || '[]').join(';'),
              `"${(r.notes || '').replace(/"/g, '""')}"`,
              r.createdAt,
            ].join(',')
          ),
        ];

        return new NextResponse(csvRows.join('\n'), {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="run-${runId}.csv"`,
          },
        });
      }

      return NextResponse.json(exportData, {
        headers: {
          'Content-Disposition': `attachment; filename="run-${runId}.json"`,
        },
      });
    }

    // Export all results with ratings
    const results = await prisma.runResult.findMany({
      where: {
        rating: { not: null },
      },
      include: {
        run: {
          include: {
            inputSet: { select: { name: true } },
            template: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const exportData = {
      exportedAt: new Date().toISOString(),
      totalResults: results.length,
      results: results.map((r) => ({
        id: r.id,
        runId: r.runId,
        stepOrder: r.stepOrder,
        outputImage: toFullUrl(baseUrl, r.outputImage),
        rating: r.rating,
        notes: r.notes,
        tags: JSON.parse(r.tags || '[]'),
        inputSet: r.run.inputSet.name,
        template: r.run.template.name,
        createdAt: r.createdAt,
      })),
    };

    if (format === 'csv') {
      const csvRows = [
        ['ID', 'Run ID', 'Step', 'Output Image', 'Rating', 'Tags', 'Notes', 'Input Set', 'Template', 'Created At'].join(','),
        ...results.map((r) =>
          [
            r.id,
            r.runId,
            r.stepOrder,
            toFullUrl(baseUrl, r.outputImage),
            r.rating || '',
            JSON.parse(r.tags || '[]').join(';'),
            `"${(r.notes || '').replace(/"/g, '""')}"`,
            `"${r.run.inputSet.name}"`,
            `"${r.run.template.name}"`,
            r.createdAt,
          ].join(',')
        ),
      ];

      return new NextResponse(csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="results-export.csv"',
        },
      });
    }

    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': 'attachment; filename="results-export.json"',
      },
    });
  } catch (error) {
    console.error('[API] Export error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
