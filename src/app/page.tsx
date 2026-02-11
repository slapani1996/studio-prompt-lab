import Link from "next/link";
import { getDbClient } from "@/lib/db";
import { getStatusColor } from "@/lib/utils";
import { FilePlus, Play, Plus } from "lucide-react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/ui/Table";

export const dynamic = "force-dynamic";

async function getStats() {
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
          0,
        ) / resultsWithRatings.length
      : 0;

  return {
    inputSets: inputSetsCount,
    prompts: promptsCount,
    runs: runsCount,
    avgRating: avgRating.toFixed(1),
  };
}

async function getRecentRuns() {
  const prisma = await getDbClient();
  return prisma.run.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      inputSet: { select: { name: true } },
      template: { select: { name: true } },
      results: { select: { id: true } },
    },
  });
}

export default async function Dashboard() {
  const stats = await getStats();
  const recentRuns = await getRecentRuns();

  return (
    <div className="md:p-8 p-4">
      <div className="md:mb-8 mb-4">
        <h1 className="lg:text-3xl text-2xl font-bold text-zinc-900 dark:text-[#eceff4]">
          Dashboard
        </h1>
        <p className="mt-2 lg:text-base text-sm text-zinc-600 dark:text-[#d8dee9]">
          Welcome to Studio Prompt Lab - your AI image generation workbench
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Input Sets" value={stats.inputSets} href="/inputs" />
        <StatCard
          title="Prompt Templates"
          value={stats.prompts}
          href="/prompts"
        />
        <StatCard title="Total Runs" value={stats.runs} href="/runs" />
        <StatCard
          title="Avg. Rating"
          value={stats.avgRating}
          suffix="/5"
          href="/review"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-[#eceff4]">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <QuickActionCard
            title="Create Input Set"
            description="Upload images and select products"
            href="/inputs?new=true"
            icon={<Plus />}
          />
          <QuickActionCard
            title="Build Prompt"
            description="Create a new prompt template"
            href="/prompts?new=true"
            icon={<FilePlus />}
          />
          <QuickActionCard
            title="Start Run"
            description="Execute prompts on input sets"
            href="/runs?new=true"
            icon={<Play />}
          />
        </div>
      </div>

      {/* Recent Runs */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-[#eceff4]">
          Recent Runs
        </h2>
        {recentRuns.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 dark:border-[#4c566a] p-8 text-center">
            <p className="text-zinc-500 dark:text-[#d8dee9]">
              No runs yet. Start by creating an input set and prompt template.
            </p>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow hoverable={false}>
                <TableHeader>Run</TableHeader>
                <TableHeader>Input Set</TableHeader>
                <TableHeader>Template</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Results</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentRuns.map((run) => (
                <TableRow key={run.id}>
                  <TableCell>
                    <Link
                      href={`/runs/${run.id}`}
                      className="text-violet-600 hover:text-violet-700 dark:text-[#88c0d0]"
                    >
                      {run.id.slice(0, 8)}...
                    </Link>
                  </TableCell>
                  <TableCell>{run.inputSet.name}</TableCell>
                  <TableCell>{run.template.name}</TableCell>
                  <TableCell>
                    <StatusBadge status={run.status} />
                  </TableCell>
                  <TableCell>{run.results.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  suffix,
  href,
}: {
  title: string;
  value: string | number;
  suffix?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:shadow-violet-500/10 dark:border-[#4c566a] dark:bg-[#3b4252]"
    >
      <p className="text-sm font-medium text-zinc-600 dark:text-[#d8dee9]">
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-[#eceff4]">
        {value}
        {suffix && (
          <span className="text-lg font-normal text-zinc-500">{suffix}</span>
        )}
      </p>
    </Link>
  );
}

function QuickActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 dark:border-[#4c566a] dark:bg-[#3b4252] dark:hover:border-[#88c0d0]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-[#5e81ac]/20 dark:text-[#88c0d0]">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-zinc-900 dark:text-[#eceff4]">
          {title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-[#d8dee9]">
          {description}
        </p>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(status)}`}
    >
      {status}
    </span>
  );
}
