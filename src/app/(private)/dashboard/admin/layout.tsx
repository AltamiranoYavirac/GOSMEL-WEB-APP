import { requireSession } from "@/features/session/server"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireSession(["admin"])

  return children
}
