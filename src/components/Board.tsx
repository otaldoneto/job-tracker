"use client";

import { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Application } from "@/generated/prisma/client";
import { Column } from "./Column";

const STATUSES: Application["status"][] = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

export function Board({ initialApplications }: { initialApplications: Application[] }) {
  const [applications, setApplications] = useState(initialApplications);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const newStatus = over.id as Application["status"];
    const applicationId = active.id as string;

    setApplications((current) =>
      current.map((application) =>
        application.id === applicationId ? { ...application, status: newStatus } : application,
      ),
    );

    await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-6">
        {STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            applications={applications
              .filter((application) => application.status === status)
              .sort((a, b) => a.position - b.position)}
          />
        ))}
      </div>
    </DndContext>
  );
}
