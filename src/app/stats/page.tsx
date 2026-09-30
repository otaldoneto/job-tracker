import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatsCharts } from "@/components/StatsCharts";
import { STATUS_LABELS } from "@/lib/status";

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().slice(0, 10);
}

export default async function StatsPage() {
  const applications = await prisma.application.findMany({
    select: { status: true, createdAt: true },
  });

  const statusCounts = (Object.keys(STATUS_LABELS) as Array<keyof typeof STATUS_LABELS>).map((status) => ({
    status: STATUS_LABELS[status],
    count: applications.filter((application) => application.status === status).length,
  }));

  const weeklyCountsMap = new Map<string, number>();
  for (const application of applications) {
    const week = getWeekStart(application.createdAt);
    weeklyCountsMap.set(week, (weeklyCountsMap.get(week) ?? 0) + 1);
  }
  const weeklyCounts = Array.from(weeklyCountsMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, count]) => ({ week, count }));

  return (
    <div className="p-6">
      <Link href="/" className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-800">
        ← Voltar
      </Link>
      <h1 className="mb-6 text-xl font-semibold text-gray-800">Estatísticas</h1>
      <StatsCharts statusCounts={statusCounts} weeklyCounts={weeklyCounts} />
    </div>
  );
}
