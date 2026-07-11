import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import MessagesClient from "#/components/messages/MessagesClient";

export const metadata = {
  title: "Tin nhắn - CASTME",
};

export default async function MessagesPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("castme_session");
  if (!sessionCookie) redirect("/login");
  
  let user = null;
  try {
    user = JSON.parse(sessionCookie.value);
  } catch (e) {
    redirect("/login");
  }

  return (
    <div className="h-full w-full">
      <Suspense fallback={<div className="p-10 flex justify-center">Đang tải...</div>}>
        <MessagesClient currentUser={user} />
      </Suspense>
    </div>
  );
}
