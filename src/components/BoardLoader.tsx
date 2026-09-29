"use client";

import dynamic from "next/dynamic";
import { Application } from "@/generated/prisma/client";

const Board = dynamic(() => import("./Board").then((mod) => mod.Board), { ssr: false });

export function BoardLoader({ initialApplications }: { initialApplications: Application[] }) {
  return <Board initialApplications={initialApplications} />;
}
