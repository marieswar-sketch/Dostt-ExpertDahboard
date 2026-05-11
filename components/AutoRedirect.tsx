"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRedirect() {
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("dostt_mobile");
    if (saved && saved.length === 10) {
      router.replace(`/dashboard?mobile=${saved}`);
    }
  }, [router]);

  return null;
}
