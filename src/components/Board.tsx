"use client";

import { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Application } from "@/generated/prisma/client";
import { Column } from "./Column";
import { NewApplicationForm } from "./NewApplicationForm";

const STATUSES: Application["status"][] = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];

export function Board({
  initialApplications,
}: {
  initialApplications: Application[];
}) {
  const [applications, setApplications] = useState(initialApplications);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const newStatus = over.id as Application["status"];
    const applicationId = active.id as string;

    setApplications((current) =>
      current.map((application) =>
        application.id === applicationId
          ? { ...application, status: newStatus }
          : application,
      ),
    );

    await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  function handleDelete(id: string) {
    setApplications((current) =>
      current.filter((application) => application.id !== id),
    );
  }

  function handleUpdate(updated: Application) {
    setApplications((current) =>
      current.map((application) => (application.id === updated.id ? updated : application)),
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <NewApplicationForm
        onCreated={(application) =>
          setApplications((current) => [...current, application])
        }
      />
      <div className="flex gap-4 overflow-x-auto p-6">
        {STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            applications={applications
              .filter((application) => application.status === status)
              .sort((a, b) => a.position - b.position)}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </DndContext>
  );
}
