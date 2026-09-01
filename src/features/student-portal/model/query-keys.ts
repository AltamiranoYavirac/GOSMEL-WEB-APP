export const studentQueryKeys = {
  all: ["student-dashboard"] as const,
  dashboard: () => [...studentQueryKeys.all, "dashboard"] as const,
};