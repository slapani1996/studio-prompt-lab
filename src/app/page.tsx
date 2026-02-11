"use client";

import { Suspense } from "react";
import Link from "next/link";
import { getStatusColor } from "@/lib/utils";
import { FilePlus, FileText, FolderOpen, Play, Plus, Star } from "lucide-react";
import {
  PaginatedTable,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { useDashboard } from "./useDashboard";

function DashboardContent() {
  const { stats, recentRuns, loading } = useDashboard();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="md:p-8 p-4 h-full">
      <div className="md:mb-5 mb-4">
        <h1 className="lg:text-3xl text-2xl font-bold text-zinc-900 dark:text-white">
          Dashboard
        </h1>
        <p className="lg:text-base text-sm text-zinc-600 dark:text-[#94969C]">
          Welcome to Studio Prompt Lab - your AI image generation workbench
        </p>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Input Sets"
          value={stats?.inputSets ?? 0}
          href="/inputs"
          icon={<FolderOpen className="h-6 w-6" />}
        />
        <StatCard
          title="Prompt Templates"
          value={stats?.prompts ?? 0}
          href="/prompts"
          icon={<FileText className="h-6 w-6" />}
        />
        <StatCard
          title="Total Runs"
          value={stats?.runs ?? 0}
          href="/runs"
          icon={<Play className="h-6 w-6" />}
        />
        <StatCard
          title="Avg. Rating"
          value={stats?.avgRating ?? "0.0"}
          suffix="/5"
          href="/review"
          icon={<Star className="h-6 w-6" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-5">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
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
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          Recent Runs
        </h2>
        <PaginatedTable
          data={recentRuns}
          columns={[
            { header: "Run" },
            { header: "Input Set" },
            { header: "Template" },
            { header: "Status" },
            { header: "Results" },
          ]}
          pageSize={5}
          emptyMessage={
            <div className="rounded-lg border border-dashed border-zinc-300 dark:border-[#333741] p-8 text-center">
              <p className="text-zinc-500 dark:text-[#94969C]">
                No runs yet. Start by creating an input set and prompt template.
              </p>
            </div>
          }
          renderRow={(run) => (
            <TableRow key={run.id}>
              <TableCell>
                <Link
                  href={`/runs/${run.id}`}
                  className="text-violet-600 hover:text-violet-700 dark:text-[#9E77ED] dark:hover:text-[#9E77ED]"
                >
                  {run.id}
                </Link>
              </TableCell>
              <TableCell>{run.inputSet.name}</TableCell>
              <TableCell>{run.template.name}</TableCell>
              <TableCell>
                <StatusBadge status={run.status} />
              </TableCell>
              <TableCell>{run.results.length}</TableCell>
            </TableRow>
          )}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

function StatCard({
  title,
  value,
  suffix,
  href,
  icon,
}: {
  title: string;
  value: string | number;
  suffix?: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:shadow-violet-500/10 dark:border-[#333741] dark:bg-[#161B26]"
    >
      <div>
        <p className="text-sm font-medium text-zinc-600 dark:text-[#94969C]">
          {title}
        </p>
        <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
          {value}
          {suffix && (
            <span className="text-lg font-normal text-zinc-500 dark:text-[#94969C]">
              {suffix}
            </span>
          )}
        </p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-[#7F56D9]/20 dark:text-[#9E77ED]">
        {icon}
      </div>
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
      className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 dark:border-[#333741] dark:bg-[#161B26] dark:hover:border-[#9E77ED]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-[#7F56D9]/20 dark:text-[#9E77ED]">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-zinc-900 dark:text-white">{title}</h3>
        <p className="text-sm text-zinc-500 dark:text-[#94969C]">
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
