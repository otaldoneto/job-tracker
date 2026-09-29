import { useDroppable } from "@dnd-kit/core";
import { Application } from "@/generated/prisma/client";
import { Card } from "./Card";
import { STATUS_LABELS } from "@/lib/status";

export function Column({
  status,
  applications,
  onDelete,
}: {
  status: Application["status"];
  applications: Application[];
  onDelete: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-72 flex-shrink-0 flex-col rounded-lg p-3 ${isOver ? "bg-blue-50" : "bg-gray-100"}`}
    >
      <h2 className="mb-3 font-semibold text-gray-700">
        {STATUS_LABELS[status]} <span className="text-gray-400">({applications.length})</span>
      </h2>
      <div className="flex flex-col gap-2">
        {applications.map((application) => (
          <Card key={application.id} application={application} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
