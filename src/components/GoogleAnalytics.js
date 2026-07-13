"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const GA_MEASUREMENT_ID = "G-QXVX1G00D4";

function pageview(url) {
  if (!window.gtag) return;

  window.gtag("event", "page_view", {
    page_path: url,
  });
}

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    pageview(pathname);
  }, [pathname]);

  return null;
}
