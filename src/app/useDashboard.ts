import { useState, useEffect } from "react";

interface Stats {
  inputSets: number;
  prompts: number;
  runs: number;
  avgRating: string;
}

interface RecentRun {
  id: string;
  status: string;
  createdAt: string;
  inputSet: { name: string };
  template: { name: string };
  results: { id: string }[];
}

interface UseDashboardReturn {
  stats: Stats | null;
  recentRuns: RecentRun[];
  loading: boolean;
}

export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentRuns, setRecentRuns] = useState<RecentRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        setStats(data.stats);
        setRecentRuns(data.recentRuns);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return { stats, recentRuns, loading };
}
