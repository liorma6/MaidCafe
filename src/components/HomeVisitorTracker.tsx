"use client";

import { useEffect } from "react";
import { recordUniqueHomeVisitor } from "@/app/actions/site-stats";

export default function HomeVisitorTracker() {
  useEffect(() => {
    void recordUniqueHomeVisitor().catch(() => {});
  }, []);

  return null;
}
