import { requireAdmin } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const admin = await requireAdmin();

  return (
    <div className="flex-1 flex min-h-screen">
      <Sidebar admin={admin} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
