import type { IDashboardWelcomeProps } from "./DashboardWelcome.types";

export default function DashboardWelcome({ studentName }: IDashboardWelcomeProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-ginger text-xs font-semibold uppercase tracking-widest">
        Student Studio
      </span>
      <h1 className="text-4xl font-bold text-cocoa dark:text-cream">
        Bienvenido de nuevo,
      </h1>
      <h2 className="text-4xl font-bold text-ginger">
        {studentName}
      </h2>
    </div>
  );
}