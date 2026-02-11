import { useState, useEffect, useCallback, useMemo } from "react";
import type { RunResult, UseReviewPageReturn } from "./types";

export type { UseReviewPageReturn } from "./types";

export function useReviewPage(): UseReviewPageReturn {
  const [allResults, setAllResults] = useState<RunResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<RunResult | null>(null);
  const [minRating, setMinRating] = useState<string>("");
  const [filterTag, setFilterTag] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (minRating) params.set("minRating", minRating);
      if (filterTag) params.set("tags", filterTag);

      const response = await fetch(`/api/results?${params}`);
      const data = await response.json();
      setAllResults(data);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  }, [minRating, filterTag]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const results = useMemo(() => {
    if (!searchQuery.trim()) return allResults;
    const query = searchQuery.toLowerCase();
    return allResults.filter((result) =>
      result.run.inputSet.name.toLowerCase().includes(query)
    );
  }, [allResults, searchQuery]);

  const getTags = useCallback((result: RunResult): string[] => {
    try {
      return JSON.parse(result.tags) || [];
    } catch {
      return [];
    }
  }, []);

  const allTags = useMemo(() => {
    return Array.from(new Set(results.flatMap((r) => getTags(r)))).sort();
  }, [results, getTags]);

  const totalResults = results.length;
  const ratedResults = useMemo(
    () => results.filter((r) => r.rating !== null),
    [results]
  );
  const avgRating = useMemo(() => {
    if (ratedResults.length === 0) return "0.0";
    return (
      ratedResults.reduce((sum, r) => sum + (r.rating || 0), 0) /
      ratedResults.length
    ).toFixed(1);
  }, [ratedResults]);
  const topRated = useMemo(
    () => results.filter((r) => r.rating && r.rating >= 4).length,
    [results]
  );

  const clearFilters = useCallback(() => {
    setMinRating("");
    setFilterTag("");
    setSearchQuery("");
  }, []);

  return {
    results,
    loading,
    selectedResult,
    minRating,
    filterTag,
    searchQuery,
    allTags,
    totalResults,
    ratedResults,
    avgRating,
    topRated,
    setSelectedResult,
    setMinRating,
    setFilterTag,
    setSearchQuery,
    clearFilters,
    fetchResults,
    getTags,
  };
}
