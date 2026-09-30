"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { Application } from "@/generated/prisma/client";
import { Column } from "./Column";
import { NewApplicationForm } from "./NewApplicationForm";
import { CardPreview } from "./Card";
import { arrayMove } from "@dnd-kit/sortable";

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
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function applicationsByStatus(status: Application["status"]) {
    return applications
      .filter((application) => application.status === status)
      .sort((a, b) => a.position - b.position);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeApplication = applications.find((application) => application.id === active.id);
    if (!activeApplication) return;

    const overId = over.id as string;
    const isOverColumn = STATUSES.includes(overId as Application["status"]);
    const destinationStatus = isOverColumn
      ? (overId as Application["status"])
      : applications.find((application) => application.id === overId)!.status;

    let reorderedIds: string[];

    if (destinationStatus === activeApplication.status) {
      const sourceItems = applicationsByStatus(activeApplication.status);
      const oldIndex = sourceItems.findIndex((application) => application.id === active.id);
      const newIndex = isOverColumn
        ? sourceItems.length - 1
        : sourceItems.findIndex((application) => application.id === overId);
      if (oldIndex === newIndex) return;
      reorderedIds = arrayMove(sourceItems, oldIndex, newIndex).map((application) => application.id);
    } else {
      const destinationItems = applications
        .filter((application) => application.status === destinationStatus)
        .sort((a, b) => a.position - b.position);
      const insertIndex = isOverColumn
        ? destinationItems.length
        : destinationItems.findIndex((application) => application.id === overId);
      destinationItems.splice(insertIndex, 0, { ...activeApplication, status: destinationStatus });
      reorderedIds = destinationItems.map((application) => application.id);
    }

    setApplications((current) =>
      current.map((application) => {
        const newIndex = reorderedIds.indexOf(application.id);
        return newIndex === -1 ? application : { ...application, status: destinationStatus, position: newIndex };
      }),
    );

    await fetch("/api/applications/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: destinationStatus, ids: reorderedIds }),
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

  const activeApplication = applications.find((application) => application.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
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
            applications={applicationsByStatus(status)}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
      <DragOverlay>{activeApplication && <CardPreview application={activeApplication} />}</DragOverlay>
    </DndContext>
  );
}
