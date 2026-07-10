// src/app/(auth)/login/page.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/?auth=login");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)" }}>
      <div className="animate-spin" style={{ width: "32px", height: "32px", border: "3.5px solid var(--border)", borderTopColor: "var(--electric)", borderRadius: "50%" }} />
    </div>
  );
}