"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { topbarQueryKeys } from "../model/topbar.query-keys";
import { searchEntities } from "../api";

export function useEntitySearch(query: string) {
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const trimmed = debounced.trim();

  return useQuery({
    queryKey: topbarQueryKeys.search(trimmed),
    queryFn: async () => {
      const { data, error } = await searchEntities(trimmed);
      if (error) throw new Error(error);
      return data;
    },
    enabled: trimmed.length >= 2,
    staleTime: 30 * 1000,
    retry: false,
  });
}
