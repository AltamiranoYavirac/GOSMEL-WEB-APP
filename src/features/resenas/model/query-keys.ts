export const resenasQueryKeys = {
  all: ["resenas"] as const,
  list: () => [...resenasQueryKeys.all, "list"] as const,
};
