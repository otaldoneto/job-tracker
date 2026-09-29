import { Application } from "@/generated/prisma/client";

export const STATUS_LABELS: Record<Application["status"], string> = {
  APPLIED: "Aplicado",
  INTERVIEW: "Entrevista",
  OFFER: "Oferta",
  REJECTED: "Recusado",
};

export const STATUS_COLORS: Record<Application["status"], string> = {
  APPLIED: "border-blue-400",
  INTERVIEW: "border-yellow-400",
  OFFER: "border-green-400",
  REJECTED: "border-red-400",
};
