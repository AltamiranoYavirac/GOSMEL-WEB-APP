export const siteAssetsAdminQueryKeys = {
  all: ["site-assets-admin"] as const,
  list: () => [...siteAssetsAdminQueryKeys.all, "list"] as const,
}
