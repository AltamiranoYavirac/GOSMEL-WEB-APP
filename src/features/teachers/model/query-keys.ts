export const teachersPublicQueryKeys = {
  all: ["teachers-public"] as const,
  lists: () => [...teachersPublicQueryKeys.all, "list"] as const,
  detail: (slug: string) => [...teachersPublicQueryKeys.all, "detail", slug] as const,
};
