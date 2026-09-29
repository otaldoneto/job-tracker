import { useDraggable } from "@dnd-kit/core";
import { Application } from "@/generated/prisma/client";

export function Card({ application }: { application: Application }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: application.id });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 10 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`rounded-md bg-white p-3 shadow-sm ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="font-medium">{application.company}</div>
      <div className="text-sm text-gray-500">{application.role}</div>
    </div>
  );
}
