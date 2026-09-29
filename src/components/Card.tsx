import { useDraggable } from "@dnd-kit/core";
import { Application } from "@/generated/prisma/client";
import { STATUS_COLORS } from "@/lib/status";
import { formatDaysAgo } from "@/lib/date";

export function Card({ application, onDelete }: { application: Application; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: application.id });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 10 }
    : undefined;

  async function handleDelete() {
    await fetch(`/api/applications/${application.id}`, { method: "DELETE" });
    onDelete(application.id);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-md border-l-4 bg-white p-3 shadow-sm transition-shadow duration-150 hover:shadow-md ${STATUS_COLORS[application.status]} ${isDragging ? "opacity-50" : ""}`}
    >
      <button
        onClick={handleDelete}
        className="absolute top-1 right-1 hidden h-5 w-5 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 group-hover:block"
      >
        ×
      </button>
      <div {...listeners} {...attributes} className="cursor-grab">
        <div className="font-medium">{application.company}</div>
        <div className="text-sm text-gray-500">{application.role}</div>
        <div className="mt-1 text-xs text-gray-400">{formatDaysAgo(application.createdAt)}</div>
      </div>
    </div>
  );
}
