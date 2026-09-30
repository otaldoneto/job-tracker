"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function StatsCharts({
  statusCounts,
  weeklyCounts,
}: {
  statusCounts: { status: string; count: number }[];
  weeklyCounts: { week: string; count: number }[];
}) {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="mb-3 font-medium text-gray-700">Candidaturas por status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusCounts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="mb-3 font-medium text-gray-700">Candidaturas por semana</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyCounts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
