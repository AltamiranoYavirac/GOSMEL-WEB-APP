export interface IDashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}
