import type { ReactNode } from "react";
import {
  dehydrate,
  HydrationBoundary,
  type FetchQueryOptions,
} from "@tanstack/react-query";

import { getServerQueryClient } from "./query-client";

interface IHydrateQueryProps {
  queries: FetchQueryOptions[];
  children: ReactNode;
}

export async function HydrateQuery({ queries, children }: IHydrateQueryProps) {
  const queryClient = getServerQueryClient();

  await Promise.all(queries.map((options) => queryClient.prefetchQuery(options)));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
  );
}
