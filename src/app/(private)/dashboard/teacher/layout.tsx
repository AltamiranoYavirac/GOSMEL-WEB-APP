import { requireSession } from "@/features/session/server"

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  await requireSession(["docente", "admin"])

  return children
}
