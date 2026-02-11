import { NextResponse } from "next/server";
import { getDbClient } from "@/lib/db";

export async function GET() {
  try {
    const prisma = await getDbClient();

    const [inputSetsCount, promptsCount, runsCount, resultsWithRatings] =
      await Promise.all([
        prisma.inputSet.count(),
        prisma.promptTemplate.count(),
        prisma.run.count(),
        prisma.runResult.findMany({
          where: { rating: { not: null } },
          select: { rating: true },
        }),
      ]);

    const avgRating =
      resultsWithRatings.length > 0
        ? resultsWithRatings.reduce(
            (sum: number, r: { rating: number | null }) => sum + (r.rating || 0),
            0
          ) / resultsWithRatings.length
        : 0;

    const stats = {
      inputSets: inputSetsCount,
      prompts: promptsCount,
      runs: runsCount,
      avgRating: avgRating.toFixed(1),
    };

    const recentRuns = await prisma.run.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        inputSet: { select: { name: true } },
        template: { select: { name: true } },
        results: { select: { id: true } },
      },
    });

    return NextResponse.json({ stats, recentRuns });
  } catch (error) {
    console.error(
      "[API] Error fetching dashboard data:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
