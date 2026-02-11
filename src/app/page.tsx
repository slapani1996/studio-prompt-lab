import Link from 'next/link';
import { getDbClient } from '@/lib/db';
import { getStatusColor } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getStats() {
  const prisma = await getDbClient();
  const [inputSetsCount, promptsCount, runsCount, resultsWithRatings] = await Promise.all([
    prisma.inputSet.count(),
    prisma.promptTemplate.count(),
    prisma.run.count(),
    prisma.runResult.findMany({
      where: { rating: { not: null } },
      select: { rating: true },
    }),
  ]);

  const avgRating = resultsWithRatings.length > 0
    ? resultsWithRatings.reduce((sum: number, r: { rating: number | null }) => sum + (r.rating || 0), 0) / resultsWithRatings.length
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
    orderBy: { createdAt: 'desc' },
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-[#eceff4]">Dashboard</h1>
        <p className="mt-2 text-zinc-600 dark:text-[#d8dee9]">
          Welcome to Studio Prompt Lab - your AI image generation workbench
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Input Sets" value={stats.inputSets} href="/inputs" />
        <StatCard title="Prompt Templates" value={stats.prompts} href="/prompts" />
        <StatCard title="Total Runs" value={stats.runs} href="/runs" />
        <StatCard title="Avg. Rating" value={stats.avgRating} suffix="/5" href="/review" />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-[#eceff4]">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <QuickActionCard
            title="Create Input Set"
            description="Upload images and select products"
            href="/inputs?new=true"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            }
          />
          <QuickActionCard
            title="Build Prompt"
            description="Create a new prompt template"
            href="/prompts?new=true"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            }
          />
          <QuickActionCard
            title="Start Run"
            description="Execute prompts on input sets"
            href="/runs?new=true"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Recent Runs */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-[#eceff4]">Recent Runs</h2>
        {recentRuns.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 dark:border-[#4c566a] p-8 text-center">
            <p className="text-zinc-500 dark:text-[#d8dee9]">No runs yet. Start by creating an input set and prompt template.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-[#4c566a]">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-[#4c566a]">
              <thead className="bg-zinc-50 dark:bg-[#3b4252]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-[#d8dee9]">
                    Run
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-[#d8dee9]">
                    Input Set
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-[#d8dee9]">
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-[#d8dee9]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-[#d8dee9]">
                    Results
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white dark:divide-[#4c566a] dark:bg-[#3b4252]">
                {recentRuns.map((run) => (
                  <tr key={run.id} className="hover:bg-zinc-50 dark:hover:bg-[#434c5e]">
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link href={`/runs/${run.id}`} className="text-violet-600 hover:text-violet-700 dark:text-[#88c0d0]">
                        {run.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-700 dark:text-[#e5e9f0]">
                      {run.inputSet.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-700 dark:text-[#e5e9f0]">
                      {run.template.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge status={run.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-700 dark:text-[#e5e9f0]">
                      {run.results.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, suffix, href }: { title: string; value: string | number; suffix?: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:shadow-violet-500/10 dark:border-[#4c566a] dark:bg-[#3b4252]"
    >
      <p className="text-sm font-medium text-zinc-600 dark:text-[#d8dee9]">{title}</p>
      <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-[#eceff4]">
        {value}
        {suffix && <span className="text-lg font-normal text-zinc-500">{suffix}</span>}
      </p>
    </Link>
  );
}

function QuickActionCard({ title, description, href, icon }: { title: string; description: string; href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 dark:border-[#4c566a] dark:bg-[#3b4252] dark:hover:border-[#88c0d0]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-[#5e81ac]/20 dark:text-[#88c0d0]">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-zinc-900 dark:text-[#eceff4]">{title}</h3>
        <p className="text-sm text-zinc-500 dark:text-[#d8dee9]">{description}</p>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}
