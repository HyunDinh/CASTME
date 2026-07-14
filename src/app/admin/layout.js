import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("castme_session");

  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    if (session.role !== "ADMIN") {
      redirect("/");
    }
  } catch {
    redirect("/login");
  }

  return (
    <div className="admin-shell">
      <div className="admin-container">{children}</div>
    </div>
  );
}
