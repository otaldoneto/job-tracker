"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Application } from "@/generated/prisma/client";
import { STATUS_COLORS } from "@/lib/status";
import { formatDaysAgo } from "@/lib/date";

export function Card({
  application,
  onDelete,
  onUpdate,
}: {
  application: Application;
  onDelete: (id: string) => void;
  onUpdate: (application: Application) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: application.id });
  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState(application.company);
  const [role, setRole] = useState(application.role);
  const [url, setUrl] = useState(application.url ?? "");

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 10 }
    : undefined;

  async function handleDelete() {
    await fetch(`/api/applications/${application.id}`, { method: "DELETE" });
    onDelete(application.id);
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/applications/${application.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, role, url: url || null }),
    });
    const updated = await response.json();
    onUpdate(updated);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <form
        onSubmit={handleSave}
        className={`flex flex-col gap-2 rounded-md border-l-4 bg-white p-3 shadow-sm ${STATUS_COLORS[application.status]}`}
      >
        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          required
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
        />
        <input
          value={role}
          onChange={(event) => setRole(event.target.value)}
          required
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
        />
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="Link (opcional)"
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
        />
        <div className="flex gap-2">
          <button type="submit" className="rounded-md bg-gray-900 px-3 py-1 text-sm text-white">
            Salvar
          </button>
          <button type="button" onClick={() => setIsEditing(false)} className="rounded-md px-3 py-1 text-sm text-gray-500">
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-md border-l-4 bg-white p-3 shadow-sm transition-shadow duration-150 hover:shadow-md ${STATUS_COLORS[application.status]} ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="absolute top-1 right-1 hidden gap-1 group-hover:flex">
        <button
          onClick={() => setIsEditing(true)}
          className="h-5 w-5 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          ✎
        </button>
        <button
          onClick={handleDelete}
          className="h-5 w-5 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      <div {...listeners} {...attributes} className="cursor-grab">
        <div className="font-medium">{application.company}</div>
        <div className="text-sm text-gray-500">{application.role}</div>
        <div className="mt-1 text-xs text-gray-400">{formatDaysAgo(application.createdAt)}</div>
      </div>
    </div>
  );
}
