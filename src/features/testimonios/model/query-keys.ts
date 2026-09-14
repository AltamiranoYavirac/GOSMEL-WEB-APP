export const testimoniosQueryKeys = {
  all: ["testimonios"] as const,
  list: () => [...testimoniosQueryKeys.all, "list"] as const,
  options: () => [...testimoniosQueryKeys.all, "options"] as const,
};