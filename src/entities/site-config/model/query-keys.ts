export const siteConfigQueryKeys = {
  all: ["site-config"] as const,
  detail: () => [...siteConfigQueryKeys.all, "detail"] as const,
};
