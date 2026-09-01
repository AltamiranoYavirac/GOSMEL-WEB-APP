export const teacherQueryKeys = {
  all: ["teacher-dashboard"] as const,
  dashboard: () => [...teacherQueryKeys.all, "dashboard"] as const,
};